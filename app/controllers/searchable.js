var log = require('log');

var currentDetailWindow;

(function constructor(args) {

	populateCollection();

	Ti.App.iOS.addEventListener('continueactivity', function (e) {
		log.args('Ti.App.iOS:continueactivity', e);

		if (e.activityType === 'com.apple.corespotlightitem') {
			$.tab.active = true;

			openDetail(e.userInfo.kCSSearchableItemActivityIdentifier);

		} else if (e.activityType === 'com.appcelerator.sample.spotlight.detail') {
			$.tab.active = true;

			openDetail(e.userInfo.id);
		}
	});

})(arguments[0] || {});

function onCollectionReset() {

	var searchableItems = [];

	Alloy.Collections.beatle.each(function (model) {

		var searchableItemAttributeSet = Ti.App.iOS.createSearchableItemAttributeSet({
			itemContentType: Ti.App.iOS.UTTYPE_IMAGE,
			title: model.get('name'),
			contentDescription: model.get('bio'),
			keywords: ['beatles', 'band', 'music', 'sample', 'spotlight'],
			thumbnailData: Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, model.get('image')).read()
		});

		var searchableItem = Ti.App.iOS.createSearchableItem({

			// FIXME: https://jira.appcelerator.org/browse/TIMOB-19474
			identifier: model.get('id'),
			
			uniqueIdentifier: model.get('id'),
			domainIdentifier: 'com.appcelerator.sample.spotlight.searchable',
			attributeSet: searchableItemAttributeSet
		});

		searchableItems.push(searchableItem);

	});

	var searchableIndex = Ti.App.iOS.createSearchableIndex();

	searchableIndex.addToDefaultSearchableIndex(searchableItems, function (e) {
		log.args('Ti.App.iOS.SearchableIndex.addToDefaultSearchableIndex', e);
	});
}

function onListViewItemclick(e) {
	openDetail(e.itemId);
}

function openDetail(id) {

	if (currentDetailWindow) {
		$.tab.close(currentDetailWindow);
	}

	var model = Alloy.Collections.beatle.get(id);

	currentDetailWindow = Alloy.createController('detail', {
		$model: model
	}).getView();

	$.tab.open(currentDetailWindow);
}

function populateCollection() {
	Alloy.Collections.beatle.reset([{
		id: 'john',
		name: 'John Lennon',
		image: '/images/john.jpg',
		wiki: 'https://en.wikipedia.org/wiki/John_Lennon',
		bio: 'John Winston Ono Lennon MBE (born John Winston Lennon; 9 October 1940 – 8 December 1980) was an English singer and songwriter who rose to worldwide fame as a co-founder of the band the Beatles, the most commercially successful band in the history of popular music. With Paul McCartney, he formed a celebrated songwriting partnership.'
	}, {
		id: 'paul',
		name: 'Paul McCartney',
		image: '/images/paul.jpg',
		wiki: 'https://en.wikipedia.org/wiki/Paul_McCartney',
		bio: 'Sir James Paul McCartney MBE (born 18 June 1942) is an English singer-songwriter, multi-instrumentalist, and composer. With John Lennon, George Harrison, and Ringo Starr, he gained worldwide fame as the bassist of the English rock band the Beatles, one of the most popular and influential groups in the history of pop music; his songwriting partnership with Lennon is one of the most celebrated of the 20th century. After the band\'s break-up, he pursued a solo career and formed Wings with his first wife, Linda, and Denny Laine.'
	}, {
		id: 'george',
		name: 'George Harrison',
		image: '/images/george.jpg',
		wiki: 'https://en.wikipedia.org/wiki/George_Harrison',
		bio: 'George Harrison,[nb 1] MBE (25 February 1943 – 29 November 2001) was an English musician, multi-instrumentalist, singer and songwriter and music and film producer who achieved international fame as the lead guitarist of the Beatles. Although John Lennon and Paul McCartney were the band\'s primary songwriters, most of their albums included at least one Harrison composition, including "While My Guitar Gently Weeps", "Here Comes the Sun" and "Something", which became the Beatles\' second-most-covered song.'
	}, {
		id: 'ringo',
		name: 'Ringo Starr',
		image: '/images/ringo.jpg',
		wiki: 'https://en.wikipedia.org/wiki/Ringo_Starr',
		bio: 'Richard Starkey,[2]` MBE (born 7 July 1940), known professionally as Ringo Starr, is an English musician and actor who gained worldwide fame as the drummer for the Beatles. He occasionally sang lead vocals, usually for one song on an album, including "With a Little Help from My Friends", "Yellow Submarine" and their cover of "Act Naturally". He also wrote the Beatles\' songs "Don\'t Pass Me By" and "Octopus\'s Garden", and is credited as a co-writer of others, such as "What Goes On" and "Flying".'
	}]);
}
