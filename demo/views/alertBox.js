//experienceBox view
(function() {
	"use strict";

	modules.AlertBox = modules.OptionBox.extend({
		initialize: function(options) {
			this.setup('alert', 'Alerts', [{
				name: 'Notification Frequency',
				class: 'frequency',
				opts: ['Weekly', 'Daily', 'Hourly', 'Every waking second']
			}, {
				name: 'Alert Method',
				class: 'method',
				opts: ['Text', 'Email', 'Pony express', 'Carrier pigeon', 'Send a runner']
			}], options.expanded);
		}
	});
})();