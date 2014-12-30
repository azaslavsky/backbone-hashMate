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
		var Router = Backbone.Router.extend({
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

			routes: {
				'article/:title': 'article',
				'options': 'options',
				'*wildcard': 'wildcard'
			},

			//Load an article (no server, so only one sample is available, regardless of ID)
			article: function(title) {
				App.view.activate(new modules.ArticleView({
					model: new modules.ArticleModel({
						title: title.replace('_', ' '),
						imgSize: this._getHashParams('article')
					}),
					params: this._getHashParams('article')
				}));
			},

			//Load the options screen
			options: function() {
				App.view.activate(new modules.OptionsView({
					model: new modules.OptionsModel(),
					params: this._getHashParams('options')
				}));
			},

			//Any other path, load an article with "sensationalistTitle"
			wildcard: function() {
				Backbone.history.navigate('article/Sensationalist_Title', {
					trigger: true,
					replace: true,
					deleteHash: { groups: true }
				});
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
		App.router = new Router();
		Backbone.history.start({
			root: '/backbone-hashMate/demo/',
			pushState: true,
			hashMate: true
		});
	};
})();