//article view
(function() {
	"use strict";

	window.modules.ArticleView = Backbone.View.extend({
		name: 'article',

		events: {
			'click button': 'changeImageSize'
		},

		initialize: function(options) {
			this.render();

			//Bind model events
			this.listenTo(this.model, 'change:size', this.renderImageSize);

			//Set the default image size
			if (options.params && options.params.imgSize) {
				if (options.params.imgSize === 'small' || options.params.imgSize === 'medium' || options.params.imgSize === 'large') {
					//Update the model to match the URL specified image size
					this.model.set('size', options.params.imgSize);
				} else {
					//Invalid image size - clear it from the URL
					Backbone.history.deleteHash({
						params: 'article/imgSize'
					});
				}
			}
		},

		render: function() {
			this.$el.addClass('article content');
			this.$el.append(' \
				<h2>'+ this.model.get('title') +'</h2> \
				<div class="articleInfo"> \
					<span class="articleBy">By '+ this.model.get('author') +'</span> \
					<span class="aricleDate">December 14</span> \
				</div> \
				<div class="articleText"> \
				</div> \
				<div class="articleImg"> \
					<div class="articleImgContainer"> \
						<div class="articleImgControls"> \
							<div class="articleImgSize selected"> \
								<button data-size="small"><i class="fa fa-photo"></i>Small</button> \
							</div> \
							<div class="articleImgSize"> \
								<button data-size="medium"><i class="fa fa-photo"></i>Medium</button> \
							</div> \
							<div class="articleImgSize"> \
								<button data-size="large"><i class="fa fa-photo"></i>Large</button> \
							</div> \
						</div> \
						<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/b/be/WLM14ES_-_Molinos_La_Mancha_-_Hugo_D%C3%ADaz-Rega%C3%B1%C3%B3n.jpg/640px-WLM14ES_-_Molinos_La_Mancha_-_Hugo_D%C3%ADaz-Rega%C3%B1%C3%B3n.jpg"> \
					</div> \
				</div> \
			');
			this.$('.articleText').append('<p>'+ this.model.get('text').replace(/\r?\n|\r/g, '</p><p>') +'</p>');
		},

		//Change the image size on the model
		changeImageSize: function(e){
			var size = $(e.currentTarget).attr('data-size');
			if (size === 'small' || size === 'medium' || size === 'large') {
				this.model.set('size', size);
			}

			//Set the hash
			Backbone.history.setHash('article/imgSize='+ size);
		},

		//Render the resized image
		renderImageSize: function(model, value) {
			var width = value === 'large' ? '100%' : (value === 'medium') ? '75%' : '';
			this.$('.articleImgContainer').css('width', width);

			//Update button highlighting
			this.$('.articleImgSize').removeClass('selected');
			this.$('button[data-size="'+ value +'"]').parent().addClass('selected');
		}
	});
})();