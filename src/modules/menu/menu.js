/**
 * Implements hook_block_view
 * @param {String} delta
 * @return {String}
 */
function menu_block_view(delta) {
  // NOTE: When rendering a jQM data-role="navbar" you can't place an
  // empty list (<ul></ul>) in it, this will cause an error:
  // https://github.com/jquery/jquery-mobile/issues/5141
  // So we must check to make sure we have any items before rendering the
  // menu since our theme_item_list implementation returns empty lists
  // for jQM pageshow async list item data retrieval and display.

  try {
    var html = '';

    // Grab the current path so we can watch out for any menu links that match
    // it.
    var path = drupalgap_path_get();

    // Are we about to view a normal menu, or the local task menu?
    if (delta == 'primary_local_tasks') {
      // LOCAL TASKS MENU LINKS - this menu needs to be dynamically rendered
      // upon the pageshow event, so for now we'll just render it as an empty
      // div container.
      html =
        '<div id="' + menu_primary_local_tasks_container_id() + '"></div>' +
        drupalgap_jqm_page_event_script_code({
            page_id: drupalgap_get_page_id(),
            jqm_page_event: 'pageshow',
            jqm_page_event_callback: '_menu_primary_local_tasks_pageshow',
            jqm_page_event_args: null
        });
    }
    else {

      // ALL OTHER MENU LINKS

      // If the block's corresponding menu exists, and it has links, iterate
      // over each link, add it to an items array, then theme an item list.
      if (drupalgap.menus[delta] && drupalgap.menus[delta].links) {
        var items = [];
        $.each(drupalgap.menus[delta].links, function(index, menu_link) {
            // Make a deep copy of the menu link so we don't modify it.
            var link = jQuery.extend(true, {}, menu_link);
            // If there are no link options, set up defaults.
            if (!link.options) { link.options = {attributes: {}}; }
            else if (!link.options.attributes) { link.options.attributes = {}; }
            // If the link points to the current path, set it as active.
            if (link.path == path) {
              if (!link.options.attributes['class']) {
                link.options.attributes['class'] = '';
              }
              link.options.attributes['class'] +=
                ' ui-btn-active ui-state-persist ';
            }
            items.push(l(link.title, link.path, link.options));
        });
        if (items.length > 0) {
          // Pass along any menu attributes.
          var attributes = null;
          if (
            drupalgap.menus[delta].options &&
            drupalgap.menus[delta].options.attributes
          ) { attributes = drupalgap.menus[delta].options.attributes; }
          html = theme('item_list', {'items': items, 'attributes': attributes});
        }
      }
    }
    return html;
  }
  catch (error) { console.log('menu_block_view - ' + error); }
}

/**
 * Implements hook_install().
 */
function menu_install() {
  try {
    // Grab the list of system menus and save each.
    var system_menus = menu_list_system_menus();
    $.each(system_menus, function(menu_name, menu) {
        menu_save(menu);
    });
  }
  catch (error) { console.log('menu_install - ' + error); }
}

/**
 * Given a menu, this adds it to drupalgap.menus. See menu_list_system_menus
 * for examples of a menu JSON object.
 * @param {Object} menu
 */
function menu_save(menu) {
  try {
    eval('drupalgap.menus.' + menu.menu_name + ' =  menu;');
  }
  catch (error) { console.log('menu_save - ' + error); }
}


/**
 * Returns the container id to use for the primary local tasks on the current
 * page.
 * @return {String}
 */
function menu_primary_local_tasks_container_id() {
  try {
    return drupalgap_get_page_id() + '_primary_local_tasks';
  }
  catch (error) {
    console.log('menu_primary_local_tasks_container_id - ' + error);
  }
}

/**
 * The pageshow callback for the primary local tasks menu.
 * @param {Object} options
 */
function _menu_primary_local_tasks_pageshow(options) {
  try {

    // @TODO - damn it, this approach still isn't working. We can't iterate over
    // paths and call drupalgap_menu_access asynchronously, jeez louise, how are
    // we going to get around this.

    // For the current page's router path, grab any local tasks menu links add
    // them into the menu. Note, local tasks are located in a menu link item's
    // children, if there are any. Local tasks typically have argument
    // wildcards in them, so we'll replace their wildcards with the current
    // args.
    var html = '';
    var router_path = drupalgap_router_path_get();
    if (
      drupalgap.menu_links[router_path] &&
      drupalgap.menu_links[router_path].children
    ) {
      var menu_items = [];
      var link_path = '';
      $.each(
        drupalgap.menu_links[router_path].children,
        function(index, child) {
          if (drupalgap.menu_links[child] &&
            (drupalgap.menu_links[child].type == 'MENU_DEFAULT_LOCAL_TASK' ||
             drupalgap.menu_links[child].type == 'MENU_LOCAL_TASK')
          ) {
            if (drupalgap_menu_access(child)) {
              menu_items.push(drupalgap.menu_links[child]);
            }
          }
        }
      );
      // If there was only one local task menu item, and it is the default
      // local task, don't render the menu, otherwise render the menu as an
      // item list as long as there are items to render.
      if (
        menu_items.length == 1 &&
        menu_items[0].type == 'MENU_DEFAULT_LOCAL_TASK'
      ) { html = ''; }
      else {
        var items = [];
        $.each(menu_items, function(index, item) {
            items.push(
              l(item.title, drupalgap_place_args_in_path(item.path))
            );
        });
        if (items.length > 0) {
          html = theme('item_list', {'items': items});
        }
      }
    }
    var container_id = menu_primary_local_tasks_container_id();
    $('#' + container_id).html(html).trigger('create');
  }
  catch (error) {
    console.log('_menu_primary_local_tasks_pageshow - ' + error);
  }
}

