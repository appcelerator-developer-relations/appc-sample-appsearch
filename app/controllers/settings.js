(function constructor(args) {

	Alloy.Collections.setting.fetch({
		success: function () {
			if (Alloy.Collections.setting.length === 0) {
				['eligibleForHandoff', 'eligibleForPublicIndexing', 'eligibleForSearch', 'needsSave'].forEach(function (property) {
					Alloy.Collections.setting.create({
						id: property,
						value: true
					});
				});
			}
		}
	});

})(arguments[0] || {});

function onListViewItemclick(e) {
	var id = e.itemId;

	var model = Alloy.Collections.setting.get(id);

	model.save({
		value: !model.get('value')
	});
}

function onSwitchChange(e) {
	var id = e.itemId;

	var model = Alloy.Collections.setting.get(id);

	model.save({
		value: e.value
	});
}

function onWindowClose(e) {
	$.destroy();
}