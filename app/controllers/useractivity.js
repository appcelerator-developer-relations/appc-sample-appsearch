var log = require('log');
var moment = require('alloy/moment');

// Reference to the activity created so we can invalidate it
var activity;

// Just to show the right status message
var justBecameCurrent = false;

/**
 * I wrap code that executes on creation in a self-executing function just to
 * keep it organised, not to protect global scope like it would in alloy.js
 */
(function constructor(args) {

	// Listen to the event that will fire when a user taps on the handoff icon
	// or the Core Spotlight search item
	Ti.App.iOS.addEventListener('continueactivity', onContinueactivity);

})(arguments[0] || {});

/**
 * Event listener for the continueactivity event which will fire when a user
 * taps on the handoff icon or the Core Spotlight search item.
 */
function onContinueactivity(e) {

	// We only respond to the writing activity
	if (e.activityType !== 'com.appcelerator.sample.spotlight.writing') {
		return;
	}

	log.args('Ti.App.iOS:continueactivity', e);

	updateStatus('the continueactivity event was fired after continuing an activity from search or another device. The message should be updated with that of the search index or other device. (see logs for details)');

	// Select our tab
	$.tab.active = true;

	// Update the message with the state of the user activity as it was handed off
	$.message.value = e.userInfo.message;
}

/**
 * Called when our tab receives focus to create the user activity and
 * make it the current by calling becomeCurrent()
 */
function createUserActivity() {

	var parameters = {

		// This value needs to be defined in tiapp.xml
		activityType: 'com.appcelerator.sample.spotlight.writing',

		// We'll receive this information when the activity is continued via handoff
		userInfo: {
			message: $.message.value
		},

		// This activity can be continued on another device
		eligibleForHandoff: true,

		// Index this activity for Spotlight as well as Siri suggestions
		eligibleForSearch: true,

		// As you can see furter on we don't add a SearchableItemAttributeSet
		// like we did in detail.js but instead use the subset of properties
		// available directly on a UserActivity
		title: 'Writing a message',
		keywords: ['writing', 'useractivity', 'appsearch', 'sample', 'alloy', 'titanium', 'appcelerator']
	};

	activity = Ti.App.iOS.createUserActivity(parameters);

	log.args('Ti.App.iOS.createUserActivity()', parameters);

	// Listen to event fired if the activity context needs to be saved before being continued on another device
	activity.addEventListener('useractivitywillsave', onUseractivitywillsave);

	// Listen to event fired when the user activity was continued on another device.
	activity.addEventListener('useractivitywascontinued', onUseractivitywascontinued);

	// Check if the user's OS version supports user activities
	if (activity.supported) {

		// Make it the current activity
		activity.becomeCurrent();
		justBecameCurrent = true;

	} else {
		log.args('Did not call becomeCurrent() because activity.supported is:', activity.supported);
	}
}

/**
 * Called when the user moves away from our tab so we can invalidate
 * the user activity. Once invalidated it cannot become current again!
 */
function invalidateActivity() {

	if (!activity) {
		return;
	}

	activity.removeEventListener('useractivitywillsave', onUseractivitywillsave);
	activity.removeEventListener('useractivitywascontinued', onUseractivitywascontinued);

	activity.invalidate();
	activity = null;

	justBecameCurrent = null;

	log.args('Ti.App.iOS.UserActivity.invalidate()');
}

/**
 * Fired if the activity context needs to be saved before being continued on another
 * device. The receiver should update the activity with current activity state.
 */
function onUseractivitywillsave(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywillsave', e);

	if (justBecameCurrent) {
		justBecameCurrent = false;

		updateStatus('the useractivitywillsave event was fired after becomeCurrent(). (see logs for details)');

	} else {
		updateStatus('the useractivitywillsave event was fired after setting needsSave to true. (see logs for details)');
	}

	activity.userInfo = {
		message: $.message.value
	};

	log.args('Updated activity.userInfo.message:', activity.userInfo.message);
}

/**
 * Fired when the user activity was continued on another device.
 */
function onUseractivitywascontinued(e) {
	log.args('Ti.App.iOS.UserActivity:useractivitywascontinued', e);

	updateStatus('the useractivitywascontinued event was fired after continuing this activity on another device. The message on the other device should now be what you had up here. (see logs for details)');
}

function onTabFocus(e) {

	if (!activity) {
		createUserActivity();
	}
}

function onTabBlur(e) {

	// The blur event is also fired when another window or alert opens over the
	// TabGroup, so we check if the tab indeed is not active anymore.
	if (!$.tab.active) {
		invalidateActivity();
	}
}

function onTextAreaChange(e) {

	// Every (appropriate) time you set this to true the activity will receive
	// the useractivitywillsave event where you can then update the activity so
	// that when handed off, the other devices has the most recent information.
	activity.needsSave = true;
}

/**
 * Helper function to show a timestamp and message in the UI.
 */
function updateStatus(text) {
	$.status.text = 'At ' + moment().format('HH:mm:ss.SS') + ' ' + text;
}
