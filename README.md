# backbone-hashMate
=================
[![License](https://img.shields.io/cocoapods/l/AFNetworking.svg)](https://github.com/azaslavsky/TextStack#license) [![Bower version](https://badge.fury.io/bo/backbone-hashmate.svg)](http://badge.fury.io/bo/backbone-hashmate) [![npm version](https://badge.fury.io/js/backbone-hashmate.svg)](http://badge.fury.io/js/backbone-hashmate) [![Dependencies](https://david-dm.org/azaslavsky/backbone-hashMate/status.svg)](https://david-dm.org/azaslavsky/backbone-hashMate#info=dependencies&view=table) [![Coverage Status](https://img.shields.io/coveralls/azaslavsky/backbone-hashMate.svg)](https://coveralls.io/r/azaslavsky/backbone-hashMate?branch=master) [![Travis Build](https://api.travis-ci.org/azaslavsky/backbone-hashMate.svg)](https://travis-ci.org/azaslavsky/backbone-hashMate) 

Like [jQuery BBQ](http://benalman.com/projects/jquery-bbq-plugin/), but for Backbone.  HashMate extends Backbone.History to store and respond to information contained in the URL's hash fragment.  Useful for state management, referral handling, history, SEO, and more.

## Jump To
* [Description](#Description)
* [Installation](#Installation)
* [Usage](#Usage)
* [API](#API)
* [Warnings](#Warnings)
* [Tests](#Tests)
* [Contributing](#Contributing)
* [License](#License)

## Description

The purpose of backbone-hashMate is to save information about the position (or state) of either a given resource, or an entire document.  This is most useful in single page apps using something similar to `pushState` to manage history, where over the course of loading many distinct paths, a "backlog" of resource specific and global states might build up that may be useful to save between disparate instances.

For example, suppose that you operate some sort of single page news app at `mynewsapp.com`.  A user has landed on your page, and clicks over to an article, located at `mynewsapp.com/article/1234`.  They then click on a picture in the article, thereby maximizing it.  Then they click on a "share" button below the maximized picture, in order to send that to a friend.  How could we communicate this state - that the picture is maximized, and that it was shared by user XYZ?  Of course, we could make a unique path fragment for this, something like `mynewsapp.com/article/1234/picture/1?referrer=XYZ`, but this carries the risk of hurting SEO by creating [duplicate content](http://moz.com/learn/seo/duplicate-content), since all three of `mynewsapp.com/article/1234`, `mynewsapp.com/article/1234/picture/1`, and `mynewsapp.com/article/1234/picture/1?referrer=XYZ` are describing the same resource to the search engine.

A better way is to put all of this extra state and location information in the hash.  Our example above could be rewritten like `mynewsapp.com/article/1234#article/picture=1234&&referrer=XYZ`.  Now, the information in the hash fragment is [opaque to crawlers like Google](http://www.oho.com/blog/explained-60-seconds-hash-symbols-urls-and-seo).  Hash fragments are encoded using the exact same URI encoding rules applies to the rest of the URL string, and are split into global parameters (things that apply to any resource on `mynewsapp.com`, like who referred the current user to the page), or resource specific groups (knowing which picture is fullscreened only makes sense for articles, so we group it into the `article/` group).  Using this format creates a logical separation between _unique resources_ (path fragments), and the _states and locations within those resources_ (hashes). 

## Installation

Installing hashMate is easy.  You can pull it from Bower...

```
bower install backbone-hashMate
```

...or grab it from NPM and manually include it as a script tag...

```
npm install backbone-hashMate --save
```

or just download this repo manually and include the file as a dependency.  Make sure you load Backbone _before_ loading Backbone.hashMate, otherwise you'll cause all sorts of trouble for yourself!

```html
<script src="./lib/backbone.js"></script>
<script src="./lib/backbone-hashMate.js"></script>
```

## Usage

While the full API for hashMate is quite robust, allowing for very detailed use of the library, really there are only three steps to creating a hashMate enabled app.  First, after loading both backbone and the backbone-hashMate library (in that order), Backbone's history is initialized using `Backbone.history.start()` exactly as described [here](http://backbonejs.org/#History-start), with the additional `hashMate: true` property in the options to activate hashMate.  It's also important to remember that hashMate does not support `hashChange` style hashbang handling at this time, and only [supports `pushState` enabled browsers](#Warnings),

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
			params: 
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
<a name="Backbone"></a>
## API
**Members**

* [Backbone](#Backbone)
  * [class: Backbone.History](#Backbone.History)
    * [history.start(options)](#Backbone.History#start)
    * [history.checkUrl()](#Backbone.History#checkUrl)
    * [history.navigate(fragment)](#Backbone.History#navigate)
    * [history.deleteHash([opts])](#Backbone.History#deleteHash)
    * [history.pluckHash([params], [group])](#Backbone.History#pluckHash)
    * [history.setHash(params, [target], [opts])](#Backbone.History#setHash)
    * [history.matchHashString(stringA, [stringB])](#Backbone.History#matchHashString)
    * [history.parseHashString([string])](#Backbone.History#parseHashString)
    * [history.getHashString([string])](#Backbone.History#getHashString)
    * [history.setHashString(params, [opts])](#Backbone.History#setHashString)

<a name="Backbone.History"></a>

* * *
###class: Backbone.History
An extended version of the default Backbone.History API

**Members**

* [class: Backbone.History](#Backbone.History)
  * [history.start(options)](#Backbone.History#start)
  * [history.checkUrl()](#Backbone.History#checkUrl)
  * [history.navigate(fragment)](#Backbone.History#navigate)
  * [history.deleteHash([opts])](#Backbone.History#deleteHash)
  * [history.pluckHash([params], [group])](#Backbone.History#pluckHash)
  * [history.setHash(params, [target], [opts])](#Backbone.History#setHash)
  * [history.matchHashString(stringA, [stringB])](#Backbone.History#matchHashString)
  * [history.parseHashString([string])](#Backbone.History#parseHashString)
  * [history.getHashString([string])](#Backbone.History#getHashString)
  * [history.setHashString(params, [opts])](#Backbone.History#setHashString)

<a name="Backbone.History#start"></a>

* * *
####history.start(options)
Extension of the default startup functionality; wraps the default method, available at: http://backbonejs.org/#History-start

**Params**

- options `options` - The default options object, but if both pushState and hashMate are true, it will enable router reaction to hash changes as well as popstate events  

<a name="Backbone.History#checkUrl"></a>

* * *
####history.checkUrl()
Replaces the default checkUrl functionality, and is only intended for private consumption

**Access**: private  
<a name="Backbone.History#navigate"></a>

* * *
####history.navigate(fragment)
Extension of the default navigation functionality; wraps the default method, available at: http://backbonejs.org/#Router-navigate

**Params**

- fragment `string` - The new fragment  
  - \[deleteHash=false\] `bbolean` | `Object` - True means we reset the entire hash, false means that nothing is cleared  
  - \[globals=false\] `bbolean` | `Array.<string>` - Setting true will clear all global variables, or an array can be specified for more granular deletion  
  - \[groups=false\] `bbolean` | `Array.<string>` - Setting true will clear all prefixed variables, or an array can be specified for more granular deletion  
  - \[addHash\] `string` | `Object` - Either an encoded string or a key->value dictionary of hash parameters to be changed along with the fragment; this will be applied after the "clear" variables are processed  
  - \[forceTrigger=false\] `bbolean` - True forces a triggered URL to load, even if the URL matches the current one; this will not work with "replace," only with "trigger" operations!  
  - \[replace=false\] `bbolean` - Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate  
  - \[trigger=false\] `bbolean` - Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate  

<a name="Backbone.History#deleteHash"></a>

* * *
####history.deleteHash([opts])
Clear all or part of the hash

**Params**

- \[opts\] `Object` - No optons means we clear the entire string  
  - \[groups=false\] `string` | `Array.<string>` | `boolean` - True means clear all grouped parameters; can also be array of specific groups to clear  
  - \[globals=false\] `string` | `Array.<string>` | `boolean` - True means clear all global parameters; can also be array of specific parameters to clear  
  - \[apply=true\] `string` | `Array.<string>` | `boolean` - True means the actual window.location.hash will be cleared immediately; if opts.target is set, this will be forced into a false state  
  - \[target\] `string` - The hash string that is being updated - this will default to window.location.hash if omitted  

**Returns**: `Object` - The new hash string  
<a name="Backbone.History#pluckHash"></a>

* * *
####history.pluckHash([params], [group])
Retrieve one or more hash parameters

**Params**

- \[params\] `Array.<string>` - A string or a list of parameters to extract; not providing it means all parameters (either global or of the requested group) will be returned  
- \[group\] `Array.<string>` - A string that serves as the group prefix for all provided parameters - if parameters have their own prefix, it will be replaced!  

**Returns**: `string` | `Object` - An object containing the requested hash parameters, or a single value if we only submit a single param  
<a name="Backbone.History#setHash"></a>

* * *
####history.setHash(params, [target], [opts])
Set one or more hash parameters

**Params**

- params `string` | `Object` - Either an encoded URI string or a key value object representing hash parameters and their respective values  
- \[target\] `string` - The hash string that is being updated - this will default to window.location.hash if omitted  
- \[opts\] `Object` - Some options  
  - \[apply=false\] `boolean` - If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method  
  - \[replace=false\] `boolean` - If true, replace URL instead of updating it, preventing a new history state from being recorded  
  - \[retrunLiteral=false\] `boolean` - If true, instead of returning the processed string, this function will return the object literal that it was compiled from  

**Returns**: `Object` - The new hash string  
<a name="Backbone.History#matchHashString"></a>

* * *
####history.matchHashString(stringA, [stringB])
Compare a hashString against the currently set one

**Params**

- stringA `string` - A hash string to try and match  
- \[stringB\] `string` - A hash string to try and match (defaults to the current window.location.hash)  

**Returns**: `boolean` - True if they match, false if they don't  
<a name="Backbone.History#parseHashString"></a>

* * *
####history.parseHashString([string])
Take a hash string, and split it into its constituent parameters

**Params**

- \[string\] `string` - A hash string to parse, which will default wo window.location.hash if not provided  

**Returns**: `Object` - A key value object representing hash parameters and their respective decoded values  
<a name="Backbone.History#getHashString"></a>

* * *
####history.getHashString([string])
Grab the current hash string

**Params**

- \[string\] `Object` - A hash string to return, which will default to window.location.hash if not provided  

**Returns**: `Object` - The hash string, with the leading hash symbol symbol removed  
<a name="Backbone.History#setHashString"></a>

* * *
####history.setHashString(params, [opts])
Apply a new hash string

**Params**

- params `Object` - A set of key value pairs to combine into a single encoded string, which we can then set as the hash  
- \[opts\] `Object` - Some options  
  - \[apply=false\] `boolean` - If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method  
  - \[replace=false\] `boolean` - If true, replace URL instead of updating it, preventing a new history state from being recorded  

**Returns**: `string` - The resulting hash string  

## Warnings
Backbone.hashMate is, as of now, only compatible with [`pushState` friendly browsers](http://caniuse.com/#feat=history).  If your application targets browsers that do not have this capability (basically any IE before IE 10), you might want to avoid hashMate until we add support for older `hashChange` style browsers.

Some might also take issue with the fact that we [are "modifying" an object we do not own](http://www.nczonline.net/blog/2010/03/02/maintainable-javascript-dont-modify-objects-you-down-own/), namely `Backbone.History`.  This is true, but unavoidable.  Backbone automatically initializes a `Backbone.History` instance as soon as it loads called `Backbone.history`, which makes total sense, because a page could not possibly need more than one instance of history tracking.  This means that the page's native and already initialized history tracking is tied to the `Backbone.History` prototype.  To remedy this, we'd need to make a new class that inherits from `Backbone.History`, stop the already running `Backbone.history` instance, and start a new instance of `Backbone.OurClassThatInheritedFromHistory`.  This would be a nightmare for end users.  We'll just have to be vigilant about new versions of Backbone, and make sure that this library is still compatible.

## Tests

You can give test suite for hashMate a quick run through in the browser of your choice [here](http://cdn.rawgit.com/azaslavsky/backbone-hashMate/master/test/jasmine.html).  You can also view results from local [Chrome tests](http://cdn.rawgit.com/azaslavsky/backbone-hashMate/master/test/results/spec/chrome.html), or the entire [browser compatibility suite]((http://cdn.rawgit.com/azaslavsky/backbone-hashMate/master/test/results/spec/chrome.html).

## Contributing

Feel free to pull and contribute!  If you do, please make a separate branch on your Pull Request, rather than pushing your changes to the Master.  It would also be greatly appreciated if you ran the appropriate tests before submitting the request.  Before submitting the request, you should do two or three sets of tests.

For unit testing the Chrome browser, which is the base target for functionality, type the following in the CLI:

```
gulp unit-chrome
```

To record the code coverage after your changes, use:

```
gulp coverage
```

And, if you have them all installed and are feeling so kind, you can also do the entire browser compatibility suite (Chrome, Canary, Firefox ESR, Firefox Developer Edition, IE 11, IE 10):

```
gulp unit-browsers
```

If you make changes that you feel need to be documented in the readme, please update the relevant files in the `/docs` directory, then run:

```
gulp docs
```