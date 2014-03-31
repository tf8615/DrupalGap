/**
 * Implements hook_menu().
 * @return {Object}
 */
function search_menu() {
  try {
    var items = {};
    items['search/%/%'] = {
      title: 'Search',
      'page_callback': 'drupalgap_get_form',
      'page_arguments': ['search_form'],
      'access_arguments': ['search content']
    };
    return items;
  }
  catch (error) { console.log('search_menu - ' + error); }
}

/**
 * The search form.
 * @param {Object} form
 * @param {Object} form_state
 * @param {String} form_id
 * @return {Object}
 */
function search_form(form, form_state, form_id) {
  try {
    var type = arg(1);
    var keys = arg(2);
    form.elements.type = {
      type: 'hidden',
      default_value: type ? type : 'node'
    };
    form.elements.keys = {
      type: 'textfield',
      title: 'Enter your keywords',
      required: true,
      default_value: keys ? keys : ''
    };
    form.elements.submit = {
      type: 'submit',
      value: 'Go',
      options: {
        attributes: {
          'data-icon': 'search'
        }
      }
    };
    return form;
  }
  catch (error) { console.log('search_form - ' + error); }
}

/**
 * The search form submit handler.
 * @param {Object} form
 * @param {Object} form_state
 */
function search_form_submit(form, form_state) {
  try {
    var type = form_state.values.type;
    var keys = form_state.values.keys;
    switch (type) {
      case 'node':
        search_node(keys, {
            success: function(results) {
              dpm(results);
              alert('Searched!');
            }
        });
        break;
      default:
        console.log('search_form_submit - unsupported type (' + type + ')');
        break;
    }
  }
  catch (error) { console.log('search_form_submit - ' + error); }
}

/**
 * The search node service.
 * @param {String} keys The keyword(s) to search for.
 * @param {Object} options
 */
function search_node(keys, options) {
  try {
    options.method = 'GET';
    options.path = 'search_node/retrieve.json&keys=' + encodeURIComponent(keys);
    options.service = 'search_node';
    options.resource = 'retrieve';
    Drupal.services.call(options);
  }
  catch (error) { console.log('search_node - ' + error); }
}