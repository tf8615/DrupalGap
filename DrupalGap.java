package com.easystreet3.drupalgap.android;

import android.content.Context;

/**
 * The DrupalGap class.
 */
public class DrupalGap {
	
	// DrupalGap variables.
	private DrupalGapAPI api;
	private Context context;

	/**
	 * The DrupalGap constructor.
	 * @param context
	 */
	public DrupalGap(Context context) {
		// Save the context.
		this.context = context;
		// Init the API.
		this.api = new DrupalGapAPI(this);
	}
	
	public Context getContext() {
		return context;
	}

	public void setContext(Context context) {
		this.context = context;
	}
}
