//article model
(function() {
	"use strict";

	modules.ArticleModel = Backbone.Model.extend({
		defaults: {
			author: 'Alex Zaslavsky',
			date: '2014-12-16T11:30:22+00:00',
			img: '',
			size: 'small', //Can also be "medium" and "large"
			title: '',
			text: 'Instead of a ridiculous news article, this is an example of how hashMate can track client position and state on a given resource.  Mess around with the size of the image below, and watch how the URL changes in response.  When other users share that link, the recipients will view this resource with that exact same image size.  This demo also tracks state changes to the theme and the options menu - try all of them out, then look at the source to see how it works!'
		}
	});
})();