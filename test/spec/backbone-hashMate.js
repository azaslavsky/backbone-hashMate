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
			Backbone.history.start({
				root: '/',
				pushState: true, 
				hashMate: true
			});
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
					expect(this.parsed).toEqual({
						'test/abc': '1',
						'test/def': '2',
						'xyz': ''
					});
				});

				it('should produce a JSON compatible object', function(){
					var tested = JSON.parse(JSON.stringify(this.parsed));
					expect(tested).toEqual({
						'test/abc': '1',
						'test/def': '2',
						'xyz': ''
					});
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

			describe('for setting hash parameters', function(){
				beforeEach(function(){
					window.location.hash = 'alpha/a=1&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz';
				});

				it('should update an existing hash value', function(){
					expect(Backbone.history.setHash({
						'alpha/a': 'success'
					})).toBe('alpha/a=success&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz');
				});

				it('should create a new hash value', function(){
					expect(Backbone.history.setHash({
						'alpha/c': 'success'
					})).toBe('alpha/a=1&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz&alpha/c=success');
				});

				it('should accept both strings and object literals', function(){
					expect(Backbone.history.setHash({
						'alpha/c': 'success'
					})).toBe('alpha/a=1&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz&alpha/c=success');
					expect(Backbone.history.setHash('alpha/c=success&beta/c=win')).toBe('alpha/a=1&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz&alpha/c=success&beta/c=win');
				});

				it('should be able to return both a JSON-literal and stringified representation of the results', function(){
					expect(Backbone.history.setHash({
						'alpha/c': 'success'
					}, {
						returnLiteral: true
					})).toEqual({
						'alpha/a': '1',
						'alpha/b': '2',
						'alpha/c': 'success',
						'beta/a': '3',
						'beta/b': '4',
						'abc': 'value',
						'xyz': '',
					});
				});

				it('should apply to window.location by defualt, but also be able to set on arbitrary strings', function(){
					expect(Backbone.history.setHash({
						'c': 'success'
					}, 'a=5&b=6')).toBe('a=5&b=6&c=success');
				});
			});

			describe('for plucking hash parameters', function(){
				beforeEach(function(){
					window.location.hash = 'alpha/a=1&alpha/b=2&beta/a=3&beta/b=4&abc=value&xyz';
				});

				it('should return an object containing all the global hash values', function(){
					expect(Backbone.history.pluckHash()).toEqual({
						'abc': 'value',
						'xyz': ''
					});
				});

				it('should return an object containing a specified global hash value', function(){
					expect(Backbone.history.pluckHash('abc')).toBe('value');
					expect(Backbone.history.pluckHash('xyz')).toBe('');
				});

				it('should return an object containing all the hash values from a certain group', function(){
					expect(Backbone.history.pluckHash(null, 'alpha')).toEqual({
						'alpha/a': '1',
						'alpha/b': '2'
					});
				});

				it('should return an object containing the specified hash value from a certain group', function(){
					expect(Backbone.history.pluckHash('a', 'alpha')).toBe('1');
					expect(Backbone.history.pluckHash('b', 'alpha')).toBe('2');
				});

				it('should return a mixed set of specified hash parameters', function(){
					expect(Backbone.history.pluckHash('beta/a')).toBe('3');
					expect(Backbone.history.pluckHash('beta/a')).toBe('3');
					expect(Backbone.history.pluckHash(['alpha/b', 'beta/a', 'fake/disallowed/value', '', 'xyz'])).toEqual({
						'alpha/b': '2',
						'beta/a': '3',
						'xyz': ''
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

			describe('for "atRoot" method', function(){
				it('should always return false when hashMate is enabled and the appropriate flag is set', function(){
					expect(Backbone.history.atRoot()).toBeTrue();

					Backbone.history._noRootCheck = true;
					expect(Backbone.history.atRoot()).toBeFalse();

					window.history.replaceState({}, '', '/testing');
					expect(Backbone.history.atRoot()).toBeFalse();

					Backbone.history._noRootCheck = false;
					expect(Backbone.history.atRoot()).toBeFalse();
				});

				it('should retain default functionality when hashMate is loaded, but disabled', function(){
					Backbone.history.options.hashMate = false;
					Backbone.history._hasHashMate = false;
					Backbone.history.options.hashChange = false;
					Backbone.history._wantsHashChange = false;
					expect(Backbone.history.atRoot()).toBeTrue();

					Backbone.history._noRootCheck = true;
					expect(Backbone.history.atRoot()).toBeTrue();

					window.history.replaceState({}, '', '/testing');
					expect(Backbone.history.atRoot()).toBeFalse();

					Backbone.history._noRootCheck = false;
					expect(Backbone.history.atRoot()).toBeFalse();
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

				it('should be able to clear all the global hash parameters', function(){
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

				it('should be able to clear a combination of whole groups and global parameters', function(){
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
							params: 'globalA',
							groups: 'testB'
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/006');
					expect(window.location.hash).toBe('#testA/1=alpha&testA/2=beta&globalB=zeta');
				});

				it('should be able to clear a specific list of parameters', function(){
					//Clear only the 'testA/1' parameter
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/010', {
						deleteHash: {
							params: 'testA/1'
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/010');
					expect(window.location.hash).toBe('#testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta');

					//Clear all the groups, and the 'globalB' parameter
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/010', {
						deleteHash: {
							params: ['globalA'],
							groups: true
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/010');
					expect(window.location.hash).toBe('#globalB=zeta');

					//Clear all the globals, and a mix of specific group parameters
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/010', {
						deleteHash: {
							params: ['testA/1', 'testB/2'],
							globals: true
						},
						trigger: true
					});

					//Clear a mix grouped and global of parameters using only the parameters array
					window.location.hash = 'testA/1=alpha&testA/2=beta&testB/1=gamma&testB/3=delta&globalA=epsilon&globalB=zeta';
					Backbone.history.navigate('a/010', {
						deleteHash: {
							params: ['testA/1', 'testA/2', 'testB/3', 'globalB'],
						},
						trigger: true
					});

					expect(window.location.pathname).toBe('/a/010');
					expect(window.location.hash).toBe('#testB/1=gamma&globalA=epsilon');
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

				it('should allow both arguments to be optional', function(){
					//No fragment
					Backbone.history.navigate({
						addHash: 'testA/1=a',
						trigger: false
					});

					expect(window.location.hash).toBe('#testA/1=a');

					//No options
					Backbone.history.navigate('abc');
					expect(window.location.pathname).toBe('/abc');
					expect(window.location.hash).toBe('#testA/1=a');
				});
			});
		});
	});



})();