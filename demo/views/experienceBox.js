//experienceBox view
(function() {
	"use strict";

	modules.ExperienceBox = modules.OptionBox.extend({
		initialize: function(options) {
			this.setup('experience', 'Experience', [{
				name: 'Bias',
				class: 'bias',
				opts: ['Boring ambivalence', 'Tedious impartiality', 'Slight favoritisim', 'Partisan hackery', 'Party newspaper', 'Basically propoganda', 'Just tell me what to think']
			}, {
				name: 'Reading Level',
				class: 'reading',
				opts: ['Quite exemplary', 'Pretty good', 'Aite', 'Me no know']
			}, {
				name: 'Content Quality',
				class: 'quality',
				opts: ['PBS', 'BBC', 'CNN', 'Fox News', 'National Enquirer', 'Only pictures of celebrities, please']
			}], options.expanded);
		}
	});
})();