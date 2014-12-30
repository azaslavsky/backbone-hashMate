//optionBox view
(function() {
	"use strict";

	modules.OptionBox = Backbone.View.extend({
		events: {
			'click .optBoxTitle': 'toggle',
			'change select': 'select'
		},

		setup: function(name, title, fields, expanded) {
			//Bind model events
			this.listenTo(this.model.get('expanded'), 'change:'+name, this.expansion)

			//Render
			this.name = name;
			this.render(name, title, fields);

			//Process the URL supplied expanded state
			if (expanded === 'expanded') {
				//Expand this box
				var state = this.model.get('expanded');
				state.set(name, true);
			} else if (expanded !== 'collapsed') {
				//Invalid option - clear it from the URL
				Backbone.history.deleteHash({
					params: 'options/'+ name
				});
			}
		},

		render: function(name, title, fields) {
			this.$el.addClass('optBox collapsed '+ name);
			var content = $(' \
				<div class="optBoxTitle"> \
					<h4>'+ title +'</h4> \
					<i class="expander fa fa-plus"></i> \
				</div> \
				<div class="optBoxBody"> \
				</div> \
			');
			var body = content.filter('.optBoxBody');

			//Add fields
			fields.forEach(function(v){
				var field, select, max;
				field = $(' \
					<div class="optField" data-field="'+ v.class +'"> \
						<span>'+ v.name +'</span> \
						<select></select> \
					</div> \
				');
				select = field.find('select');
				max = v.opts.length - 1;

				v.opts.forEach(function(vv, ii){
					select.append('<option value="'+ (max - ii) +'">'+ vv +'</option>');
				});
				body.append(field);
			});

			//Populate body
			this.$el.append(content);
		},

		//Toggle expanded/closed state of the optionBox
		toggle: function() {
			var state = this.model.get('expanded');
			var newState = !state.get(this.name);
			state.set(this.name, newState);

			//Set the hash
			var newStateHash = {};
			newStateHash['options/'+this.name] = newState ? 'expanded' : 'collapsed'
			Backbone.history.setHash('options/'+ this.name +'='+ (newState ? 'expanded' : 'collapsed'));
		},

		//Render an expanded state
		expansion: function(model, value) {
			if (value) {
				this.$('i.fa').addClass('fa-minus').removeClass('fa-plus');
				this.$el.removeClass('collapsed');
			} else {
				this.$el.addClass('collapsed');
				this.$('i.fa').addClass('fa-plus').removeClass('fa-minus');
			}
		},

		//Update the model to match the selection
		select: function(e) {
			this.model.set($(e.currentTarget).parent().attr('data-field'), parseInt(e.currentTarget.options[e.currentTarget.selectedIndex].value, 10));
		}
	});
})();