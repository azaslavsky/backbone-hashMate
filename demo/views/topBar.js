//topBar view
(function() {
	"use strict";

	modules.TopBarView = Backbone.View.extend({
		tagName: 'div',

		events: {
			'click #TopTheme': 'changeTheme',
			'click .topTab': 'changeTab'
		},

		initialize: function() {
			this.render();

			//Bind model events
			this.listenTo(this.model, 'change:theme', this.renderTheme);
			this.listenTo(this.model, 'change:tab', this.renderTab);
		},

		render: function() {
			this.$el.attr('id', 'TopBar');
			this.$el.append(' \
				<span id="TopTitle">Fakenewsapp.com</span> \
				<div id="TopTabs"> \
					<div id="ArticleTab" data-tab="article" class="topTab"> \
						<i class="fa fa-comment topTabIcon"></i><span>Article</span> \
					</div> \
					<div id="OptionsTab" data-tab="options" class="topTab"> \
						<i class="fa fa-gear topTabIcon"></i><span>Options</span> \
					</div> \
				</div> \
				<div id="TopTheme" title="Watch how the URL changes when you swap themes..."> \
					<span class="themeText">Change Theme:</span> \
					<div class="themeBubble"> \
						<span class="themeChoice themeWhite">White</span> \
						<span class="themeChoice themeDark">Dark</span> \
					</div> \
				</div> \
			');
		},

		//Change the tab
		changeTab: function(e) {
			var newTab = $(e.currentTarget).attr('data-tab');
			this.model.tab !== newTab && this.model.set('tab', newTab);
		},

		//Render the tab selection
		renderTab: function(model, value) {
			this.$('.topTab').removeClass('selected');
			this.$('.topTab[data-tab="'+ value +'"]').addClass('selected');
		},

		//Change the theme
		changeTheme: function(e) {
			var newTheme = this.model.get('theme') === 'white' ? 'dark' : 'white';
			this.model.set('theme', newTheme);

			//Update hash
			Backbone.history.setHash({
				'theme': newTheme
			});
		},

		//Respond to theme changes
		renderTheme: function(model, value) {
			if (value === 'dark') {
				this.$('.themeWhite').css('margin-top', '-24px');
			} else {
				this.$('.themeWhite').css('margin-top', '');
			}
		}
	});
})();