/* global $model */

var moment = require('alloy/moment');

var log = require('log');

var activity;

(function constructor(args) {

})(arguments[0] || {});

function createUserActivity() {

	// Make sure any existing activity is invalidated
	invalidateActivity();

	var parameters = {

		// The value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.spotlight.detail',

		name: $model.get('name'),

		keywords: ['view', 'spotlight', 'sample', 'alloy', 'titanium', 'appcelerator'],

		userInfo: {
			id: $model.get('id')
		},

		eligibleForHandoff: Alloy.Collections.setting.get('eligibleForHandoff').get('value'),
		eligibleForPublicIndexing: Alloy.Collections.setting.get('eligibleForPublicIndexing').get('value'),
		eligibleForSearch: Alloy.Collections.setting.get('eligibleForSearch').get('value'),

		// Try searching both soon after you focus on this tab and then about 5
		// minutes later again. The second time you should not find it.
		expirationDate: moment().add(3, 'minutes').format('YYYY-MM-DD[T]HH:mm:ss.SSSZZ'),

		// regardless of the setting, the first call to becomeCurrent() will
		// always trigger the useractivitywillsave event
		needsSave: Alloy.Collections.setting.get('needsSave').get('value'),

		// requiredUserInfoKeys: ['id'],
		// webpageURL: 'http://googl.com/#q=message'
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	activity.addContentAttributeSet(Ti.App.iOS.createSearchableItemAttributeSet({
		itemContentType: Ti.App.iOS.UTTYPE_PLAIN_TEXT,
		contentDescription: $model.get('bio')
	}));

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	if (activity.supported) {
		activity.becomeCurrent();
	} else {
		alert('UserActivity is not supported');
	}
}

function invalidateActivity() {

	if (activity) {
		activity.invalidate();
		activity = null;

		log.args('Ti.App.iOS.UserActivity.invalidate()');
	}
}

function onWindowFocus(e) {
	createUserActivity();
}

function onWindowBlur(e) {
	invalidateActivity();
}

function openURL() {
	Ti.Platform.openURL($model.get('wiki'));
}