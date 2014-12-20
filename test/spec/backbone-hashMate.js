/*
 * Jasmine test suite for hashMate
 */
(function() {
	describe('Backbone HashMate', function(){
		//window.history.replaceState({}, '', '/');
		var statePushes = 0;

		beforeEach(function(){
			Backbone.history.start({pushState: true, hashMate: true});
		});

		afterEach(function(){
			Backbone.history.stop();
			Backbone.history.hashString = '';
			window.location.hash = '';

			for (var i = 0; i < statePushes; i++) {
				window.history.back();
			}
			window.history.replaceState({}, '', '/');
			statePushes = 0;
		});

		describe('Native Backbone.History API functionality', function(){

			describe('for "start" method', function(){
				it('should initialize a single history tracker', function(){
					expect(Backbone.history.start).toThrow();
				});

				it('should initialize hash change events if the "hashMate" option is true', function(){
					spyOn(Backbone.history, 'loadUrl').and.callThrough();
					window.location.hash = 'test/123';

					expect(Backbone.history.options.hashChange).toBeTrue();
					//expect(Backbone.history.loadUrl).toHaveBeenCalled();
				});
			});

			describe('for "checkUrl" method', function(){
				it('should ignore unchaged URL fragments', function(){
					window.history.pushState({}, '/test/123');
					statePushes++;
					expect(Backbone.history.checkUrl()).toBeFalse();
				});

				it('should trigger a navigation event when a new URL fragment is loaded', function(){
					Backbone.history.fragment = 'test/123';
					expect(Backbone.history.checkUrl()).toBeUndefined();
				});
			});

			/*xdescribe('for navigate" method', function(){
				it('', function(){
				});
			});*/
		});
	});
})();