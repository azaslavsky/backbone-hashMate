//The main app container for our fake news app
(function() {
	"use strict";

	//Clear the path and hash
	window.history.replaceState({}, '', '/');
	window.location.hash = '';

	//Create a global object for storing app views and models
	window.App = {
		Models: {},
		Views: {},
		contentAreaView: null //Trach thew view currently loaded in the content area
	};

	//Once all of the models and views have been loaded, start the app
	window.App.start = function(){
		//Create a router to manage routes
		window.App.router = Backbone.Router.extend({
			//Get the hash parameters relevant to a particular group
			_getHashParams: function(group){
				var stripped;
				var mapped = {};
				var hash = Backbone.history.pluckHash(Backbone.history.parseHashString(), group);

				//Remove route prefixes
				for (var k in hash) {
					stripped = k.split('/');
					if (stripped.length === 2) {
						mapped[stripped[1]] = hash[k];
					}
				}
				return mapped;
			},

			//Clear an old view from the content area before loading a new one
			_clearOldView: function(){
				window.App.contentAreaView && window.App.contentAreaView.remove(); //Note - doing just this without cleaning up the model first could cause memory leaks, but its a sample app, so screw it
			},

			routes: {
				'article/:id': 'article',
				'options': 'options'
			},

			//Load an article (no server, so only one sample is available, regardless of ID)
			article: function(id) {
				this._clearOldView();
			},

			//Load the options screen
			options: function() {
				this._clearOldView();
			}
		});
	};
})();