//options model
(function() {
	"use strict";

	modules.OptionsModel = Backbone.Model.extend({
		defaults: {
			bias: 0,
			reading: 0,
			quality: 0,
			frequency: 0,
			method: 0,
			expanded: new Backbone.Model({
				experience: false,
				alerts: false
			})
		}
	});
})();