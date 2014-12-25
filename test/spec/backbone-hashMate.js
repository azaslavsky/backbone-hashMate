/*
 * Jasmine test suite for hashMate
 */
(function() {
	describe('Backbone HashMate', function(){
		//Basic setup and tracking
		window.history.replaceState({}, '', '/');
		var statePushes = 0;
		var state;
		var router;



		//A sample router for testing
		var Router = Backbone.Router.extend({
			_getHashParams: function(){
				var stripped;
				var mapped = {};
				var hash = Backbone.history.pluckHash(params, 'thread');

				//Remove route prefixes
				for (var k in hash) {
					stripped = k.split('/');
					if (stripped.length === 2) {
						mapped[stripped[1]] = hash[k];
					}
				}
				return mapped;
			},

			routes: {
				'a/:id': 'sampleId',
				'b': 'sampleHash'
			},

			sampleId: function(id){
				state = id;
			},

			sampleHash: function(id){
				state = id;
			},
		});



		//Setup and teardown
		beforeEach(function(){
			router = new Router;
			Backbone.history.start({pushState: true, hashMate: true});
		});

		afterEach(function(done){
			state = null
			router = null;
			Backbone.history.stop();
			Backbone.history.hashString = '';
			window.location.hash = '';

			for (var i = 0; i < statePushes; i++) {
				window.history.back();
			}
			statePushes = 0;

			setTimeout(function(){
				window.history.replaceState({}, '', '/');
				done();
			}, 20);
		});



		describe('Extended Backbone.History API functionality', function(){
			describe('for getting a whole hash string', function(){
				it('should return a supplied hash string, without the pound symbol', function(){
					expect(Backbone.history.getHashString('###abc')).toBe('abc');
				});

				it('should return the window\'s currently set hash value if the supplied argument is omitted or incorrect', function(){
					window.location.hash = 'test/abc';
					expect(Backbone.history.getHashString(4)).toBe('test/abc');
					expect(Backbone.history.getHashString({})).toBe('test/abc');
					expect(Backbone.history.getHashString()).toBe('test/abc');
				});
			});

			describe('for matching a hash string', function(){
				it('should match two arbitrary strings', function(){
					expect(Backbone.history.matchHashString('abc/123', 'abc/123')).toBe(true);
					expect(Backbone.history.matchHashString('abc/123', 'xyz/000')).toBe(false);
				});

				it('should match an arbitrary string against the current hash string', function(){
					window.location.hash = 'abc/123';
					expect(Backbone.history.matchHashString('abc/123')).toBe(true);
					expect(Backbone.history.matchHashString('xyz/000')).toBe(false);
				});
			});

			describe('for parsing a hash string', function(){
				beforeEach(function(){
					window.location.hash = 'test/abc=1&test/def=2&xyz';

					this.parsed = Backbone.history.parseHashString();
				});

				it('should parse both key value pairs and lone keys', function(){
					expect(this.parsed).toEqual(jasmine.objectContaining({
						'test/abc': '1',
						'test/def': '2',
						'xyz': ''
					}));
				});

				it('should produce a JSON compatible object', function(){
					var tested = JSON.parse(JSON.stringify(this.parsed));
					expect(tested).toEqual(jasmine.objectContaining({
						'test/abc': '1',
						'test/def': '2',
						'xyz': ''
					}));
				});
			});

			describe('for setting a hash string', function(){
				it('should be able to set an encoded object of parameters', function(){
					var str = Backbone.history.setHashString({
						'test/abc': '1',
						'xyz': '',
						'wuv': true,
						'test/1234': 5,
						'test/5678': '":"'
					});
					expect(str).toBe('test/abc=1&xyz&wuv=true&test/1234=5&test/5678=%22%3A%22');
				});

				it('should be able to apply the hash string immediately', function(){
					Backbone.history.setHashString({
						'test/abc': '1',
						'xyz': '',
						'wuv': true,
						'test/1234': 5,
						'test/5678': '":"'
					}, {
						apply: true
					});
					expect(Backbone.history.getHashString()).toBe('test/abc=1&xyz&wuv=true&test/1234=5&test/5678=%22%3A%22');
				});
			});
			});
		});



		describe('Native Backbone.History API functionality', function(){

			describe('for "start" method', function(){
				it('should initialize a single history tracker', function(){
					expect(Backbone.history.start).toThrow();
				});

				it('should initialize hash change events if the "hashMate" option is true', function(){
					spyOn(Backbone.history, 'loadUrl').and.callThrough();
					window.location.hash = 'test/abc';

					expect(Backbone.history.options.hashChange).toBeTrue();
					expect(Backbone.history.loadUrl).toHaveBeenCalled();
				});
			});

			describe('for "checkUrl" method', function(){
				it('should ignore unchaged URL fragments', function(){
					window.history.pushState({}, '/test/abc');
					statePushes++;
					expect(Backbone.history.checkUrl()).toBeFalse();
				});

				it('should trigger a navigation event when a new URL fragment is loaded', function(){
					Backbone.history.fragment = 'test/abc';
					expect(Backbone.history.checkUrl()).toBeUndefined();
				});
			});

			describe('for navigate" method', function(){
				it('should still trigger new routes', function(){
					Backbone.history.navigate('a/000', {
						trigger: true
					});

					expect(state).toBe('000');
				});

				it('should still replace existing routes', function(){
					Backbone.history.navigate('a/001', {
						replace: true
					});

					expect(window.location.pathname).toBe('/a/001');
				});

				it('should be able to force a trigger on unchanged routes', function(){
					window.history.replaceState({}, '', '/a/002');
					expect(window.location.pathname).toBe('/a/002');

					Backbone.history.navigate('a/002', {
						forceTrigger: true,
						trigger: true
					});

					expect(state).toBe('002');
				});

				it('should be able to clear the entire hash string', function(){
					window.location.hash = 'test/1';
					Backbone.history.navigate('a/003', {
						deleteHash: true,
						trigger: true
					});

					expect(window.location.hash.length).toBeLessThan(2); //Accepts either '#' or ''
				});

				it('should be able to clear one or more global hash parameters', function(){
					//Clear all the globals
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/004', {
						deleteHash: {
							globals: true
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/004');
					expect(window.location.hash).toBe('#testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta');

					//Clear only the 'globalB' global
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/004', {
						deleteHash: {
							globals: ['globalB']
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/004');
					expect(window.location.hash).toBe('#testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon');
				});

				it('should be able to clear one or more specified grouping of hash parameters', function(){
					//Clear all the groups
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/005', {
						deleteHash: {
							groups: true
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/005');
					expect(window.location.hash).toBe('#globalA=epsilon&globalB=zeta');

					//Clear only the 'testA' group
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/005', {
						deleteHash: {
							groups: ['testA']
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/005');
					expect(window.location.hash).toBe('#testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta');
				});

				it('should be able to clear a combination of groups and global parameters', function(){
					//Clear everything
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/006', {
						deleteHash: {
							globals: true,
							groups: true
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/006');
					expect(window.location.hash.length).toBeLessThan(2); //Accepts either '#' or ''

					//Clear only the 'testB' group and the 'globalA' variable
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/006', {
						deleteHash: {
							globals: 'globalA',
							groups: 'testB'
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/006');
					expect(window.location.hash).toBe('#testA/1=alpha&testA/2=beta&globalB=zeta');
				});

				it('should be able to set a hash string', function(){
					var output;

					//Test for global params
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/007', {
						addHash: 'globalC=whatever',
						trigger: true
					});

					output = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta&globalC=whatever'
					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);

					//Test for grouped params
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/007', {
						addHash: 'testA/3=whatever',
						trigger: true
					});

					output = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta&testA/3=whatever';
					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);
				});

				it('should be able to change an existing hash string', function(){
					var output;

					//Test for global params
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/008', {
						addHash: 'globalB=whatever',
						trigger: true
					});

					output = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=whatever';
					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);

					//Test for grouped params
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/008', {
						addHash: 'testB/1=whatever',
						trigger: true
					});

					output = 'testA/1=alpha&testA/2=beta&testB/1=whatever&testB/3=delta&globalA=epsilon&globalB=zeta';
					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);
				});

				it('should be able to set multiple hash parameters', function(){
					var output = 'testA/1=al&testA/2=beta&testB/1=gamma&testB/3=de&globalA=ep&globalB=zeta';

					//As a string
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/007', {
						addHash: 'testA/1=al&testB/3=de&globalA=ep',
						trigger: true
					});

					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);

					//As an object
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/007', {
						addHash: {
							'testA/1': 'al',
							'testB/3': 'de',
							'globalA': 'ep'
						},
						trigger: true
					});

					expect(window.location.hash).toBe('#' + output);
					expect(Backbone.history.hashString).toBe(output);
				});
			});
		});
	});



})();