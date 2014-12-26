
## Usage

While the full API for hashMate is quite robust, allowing for very detailed use of the library, really there are only three steps to creating a hashMate enabled app.  First, after loading both backbone and the backbone-hashMate library (in that order), Backbone's history is initialized using `Backbone.history.start()` exactly as described [in the Backbone docs](http://backbonejs.org/#History-start), with the additional `hashMate: true` property in the options to activate hashMate.

```javascript
Backbone.history.start({
	pushState: true,
	hashMate: true
});
```

When you add routers, make sure that they are able to process the hash parameters that would be relevant to that route.  For example:

```javascript
//A sample router for testing
var MyRouter = Backbone.Router.extend({
	//Private method to get the parameters for a particular group
	_getHashParams: function(group){
		var stripped;
		var mapped = {};
		var hash = Backbone.history.pluckHash(Backbone.history.parseHashString(), group);

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
		'sample/:id': 'sample',
		'demo': 'demo'
	},

	sample: function(id){
		var params = this._getHashParams('sample');
		//Do something with the id and params
		var sampleView = new SampleView({
			params: params
		});
		Backbone.$('body').append(sampleView.el);
	},

	demo: function(){
		var params = this._getHashParams('demo');
		//Do something with the params
	},
});
```

Then, whenever a state change occurs in your view, simply use `Backbone.history.navigate` like always, setting the new "addHash" property to trigger the navigation

```javascript
//This will work
Backbone.history.navigate('sample/1234', {
	trigger: false,
	addHash: {
		'foo': 'bar'
	}
});

//So will this
Backbone.history.navigate('sample/1234#foo=bar', {
	trigger: false
});
```