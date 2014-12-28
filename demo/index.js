//The main app container for our fake news app
(function() {
	"use strict";

	//Clear the path and hash
	//window.history.replaceState({}, '', '/');
	//window.location.hash = '';



	//Stand in for an actual module manager, like RequireJS or Browserify; this demo is too small to mess with all that
	window.modules = {};



	//Create a global object for storing app views and models
	window.App = {};



	//Once all of the models and views have been loaded, start the app
	App.start = function(){
		//Create a router to manage routes
		App.router = Backbone.Router.extend({
			//Get the hash parameters relevant to a particular group
			_getHashParams: function(group) {
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
				App.view.active && App.view.active.remove(); //Note - doing just this without cleaning up the model first could cause memory leaks, but its a sample app, so screw it
			},

			routes: {
				'article/:title': 'article',
				'options': 'options',
				'*': 'wildcard'
			},

			//Load an article (no server, so only one sample is available, regardless of ID)
			article: function(title) {
				this._clearOldView();
			},

			//Load the options screen
			options: function() {
				this._clearOldView();
			},

			//Any other path, load an article with "sensationalistTitle"
			wildcard: function() {
				this.article('sensationalistTitle');
			}
		});

		

		//Create a model and view for the app
		var params = Backbone.history.pluckHash();
		App.model = new modules.AppModel();
		App.view = new modules.AppView({
			el: $('body'),
			model: window.App.model,
			params: params
		});



		//Start history tracking
		Backbone.history.start({
			//root: '/backbone-hashMate/demo/',
			pushState: true,
			hashMate: true
		});
	};
})();