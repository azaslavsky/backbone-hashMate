//app view
(function() {
	"use strict";

	modules.AppView = Backbone.View.extend({
		//Track active view in "#Main" div
		active: null,

		initialize: function(options) {
			var params = options.params;

			this.render();

			//Append a topBar
			this.topBarView = new window.modules.TopBarView({
				model: this.model
			});
			this.$('#Nav').append(this.topBarView.$el);

			//Bind model events
			this.listenTo(this.model, 'change:theme', this.theme);

			//Deal with global parameters
			if (params) {
				//Is there a theme?
				if (params.theme === 'dark') {
					//It's a dark theme - set the model
					this.model.set('theme', 'dark');
				} else if (params.theme !== 'white') {
					//Invalid theme - clear it from the URL
					Backbone.history.deleteHash({
						params: 'theme'
					});
				}
			}
		},

		render: function() {
			this.$el.append(' \
				<div id="Nav"></div> \
				<div id="Main"></div> \
			');
		},

		//Change the app theme
		theme: function(model, value){
			if (value === 'dark') {
				this.$el.addClass('dark');
			} else {
				this.$el.removeClass('dark');
			}
		}
	});
})();