//options view
(function() {
	"use strict";

	modules.OptionsView = Backbone.View.extend({
		name: 'options',

		initialize: function(options) {
			this.render();
			this.experienceBox = new modules.ExperienceBox({
				model: this.model,
				expanded: typeof options.params === 'object' && options.params['experience']
			});
			this.$el.append(this.experienceBox.$el);

			this.alertBox = new modules.AlertBox({
				model: this.model,
				expanded: typeof options.params === 'object' && options.params['alert']
			});
			this.$el.append(this.alertBox.$el);
		},

		render: function() {
			this.$el.addClass('options content');
			this.$el.append('<h2>Options</h2>');
		},
	});
})();