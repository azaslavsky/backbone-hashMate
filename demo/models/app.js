//app model
(function() {
	"use strict";
	
	modules.AppModel = Backbone.Model.extend({
		defaults: {
			theme: 'white',
			tab: 'article'
		}
	});
})();