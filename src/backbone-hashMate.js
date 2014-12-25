//Use hash events with Backbone.History's pushState enabled
(function(root, factory) {
	/* istanbul ignore next */
	if (typeof define === 'function' && define.amd) { //AMD
		define(['underscore', 'backbone'], function(_, Backbone) {
			return factory(root, Backbone, _);
		});
	} else if (typeof exports !== 'undefined') { //CommonJS or node.js
		var _ = require('underscore'),
			Backbone = require('backbone');
		factory(root, Backbone, _);
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = Backbone;
		}
		exports = Backbone;
	} else { //Browser
		factory(root, root.Backbone, root._);
	}

}(this, function(root, Backbone, _) {
	"use strict";



	var start = Backbone.History.prototype.start;
	/**
	 * Extension of the default startup functionality
	 * @method
	 * @param {options} options The default options object, but if both pushState and hashMate are true, it will enable router reaction to hash changes as well as popstate events
	*/
	Backbone.History.prototype.start = function(options){
		//Override checkUrl
		var prototype = this.prototype || this.__proto__;
		this.checkUrl = prototype.checkUrl.bind(this);

		//If "options.hashMate" is true, ensure that options.hashchange is true as well
		options.hashChange = options.hashMate ? true : options.hashChange;

		//Do the default start procedure
		var loaded = start.call(this, options);

		//If we are listening to hashChanges, enable that listener as well
		/*if (this._wantsPushState && this._wantsHashChange && ('onhashchange' in window)) {
			if (!this.navigationInProgress) {
				Backbone.$(window).on('hashchange', this.checkUrl);
			}
		}*/
		return loaded;
	};



	/**
	 * Replace the default checkUrl function
	 * @method
	*/
	Backbone.History.prototype.checkUrl = function(e){
		if ( this.getFragment() === this.fragment && (this.hashString === this.getHashString() || !this.options.hashMate) ) {
			return false;
		}

		//Update the active hash, then load the Url (the active fragment is updated by the loadUrl method)
		this.hashString = this.getHashString();
		this.loadUrl();
	};



	var navigate = Backbone.History.prototype.navigate;
	/**
	 * Extension of the default navigation functionality
	 * @method
	 * @param {string} fragment The new fragment
	 * @param {bbolean|Object} [opts.deleteHash=false] True means we reset the entire hash, false means that nothing is cleared
	 * @param {bbolean|string[]} [opts.deleteHash.globals=false] Setting true will clear all global variables, or an array can be specified for more granular deletion
	 * @param {bbolean|string[]} [opts.deleteHash.groups=false] Setting true will clear all prefixed variables, or an array can be specified for more granular deletion
	 * @param {string|Object} [opts.addHash] Either an encoded string or a key->value dictionary of hash parameters to be changed along with the fragment; this will be applied after the "clear" variables are processed
	 * @param {bbolean} [opts.forceTrigger=false] True forces a triggered URL to load, even if the URL matches the current one; this will not work with "replace," only with "trigger" operations!
	 * @param {bbolean} [opts.replace=false] Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate
	 * @param {bbolean} [opts.trigger=false] Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate
	*/
	Backbone.History.prototype.navigate = function(fragment, opts){
		opts = opts || {};
		var hash = '';

		//Disable any the hashMate hashchange listener
		this.navigationInProgress = true;

		//Make any requested deletions
		hash = opts.deleteHash && this.deleteHash( typeof opts.deleteHash === 'object' ? _.extend(opts.deleteHash, {apply: false}) : {apply: false} );

		//Extend the hash with the new additions, if available
		hash = (opts.deleteHash || opts.addHash) ? this.setHash(opts.addHash, hash, {apply: true}) : this.getHashString(hash);

		if (opts.forceTrigger) {
			//Force a navigation action, even if the fragment and hash are exactly the same
			this.fragment = '';
		} else if ( this.fragment === fragment && hash === this.hashString ) {
			//If both the hash AND the fragment match, call the whole thing off
			this.navigationInProgress = false;
			return;
		}

		//Fire the default navigate method, and update the current hash value
		navigate.call(this, fragment+'#'+hash, opts);
		this.hashString = hash;

		//Re-enable the hashMate hashchange listener
		this.navigationInProgress = false;
	};



	/**
	 * Clear all or part of the hash
	 * @method
	 * @param {Object} [opts] No optons means we clear the entire string
	 * @param {string|string[]|boolean} [opts.groups=false] True means clear all grouped parameters; can also be array of specific groups to clear
	 * @param {string|string[]|boolean} [opts.globals=false] True means clear all global parameters; can also be array of specific parameters to clear
	 * @param {string|string[]|boolean} [opts.apply=true] True means the actual window.location.hash will be cleared immediately; if opts.target is set, this will be forced into a false state
	 * @param {string} [opts.target] The hash string that is being updated - this will default to window.location.hash if omitted
	 * @retrurn {Object} The new hash string
	*/
	Backbone.History.prototype.deleteHash = function(opts){
		//Sort parameters
		opts = opts || {};
		opts.apply = opts.target ? false : (typeof opts.apply === 'boolean' ? opts.apply : true);
		opts.groups = typeof opts.groups === 'string' ? [opts.groups] : opts.groups;
		opts.globals = typeof opts.globals === 'string' ? [opts.globals] : opts.globals;
		var params = this.parseHashString(opts.target);


		//Cycle through each parameter, deleting it if necessary
		if (opts.groups || opts.globals) {
			var type, test;
			for (var k in params) {
				type = k.indexOf('/') > -1 ? 'groups' : 'globals';
				if (opts[type]) {
					if (opts[type] instanceof Array && opts[type].indexOf( k.split('/')[0] ) === -1) {
						//This is a group or global variable that was not in the provided list, so ignore its children
						continue;
					}
					delete params[k];
				}
			}

			//If we've emptied out the parameters, set the variable to null
			if (params && !Object.keys(params).length) {
				params = null;
			}
		} else {
			params = null;
		}

		//Set the new hashString
		return this.setHashString(params, opts);
	};



	/**
	 * Retrieve one or more hash parameters
	 * @method
	 * @param {string[]} [params] A string or a list of parameters to extract; not providing it means all parameters (either global or of the requested group) will be returned
	 * @param {string[]} [group] A string that serves as the group prefix for all provided parameters - if parameters have their own prefix, it will be replaced!
	 * @retrurn {string|Object} An object containing the requested hash parameters, or a single value if we only submit a single param
	*/
	Backbone.History.prototype.pluckHash = function(params, group){
		//Sort parameters
		var single = false;
		if (params && typeof params === 'string') {
			single = true;
			params = [params];
		}

		var values = {}, parsed = this.parseHashString();
		if (params && params.length) {
			//A specific set of hash parameters has been requested
			var mapped = [];
			params.forEach(function(v){
				var key = v;
				if (!key.length) {
					return;
				}

				//Apply appropriate group prefix
				if (v.indexOf('/') !== v.lastIndexOf('/')) {
					return; //We have more than one slash in the key
				}
				if (group && v.indexOf('/') === -1) {
					key = group +'/'+ v[0];
				}

				//Save the modified key
				if (mapped.indexOf(key) === -1) {
					mapped.push(key);
				}
			});

			//Cycle through each mapped parameter, and try and get it's value from the parsed string
			mapped.forEach(function(v){
				if (parsed[v]) {
					values[v] = parsed[v];
				} else {
					values[v] = '';
				}
			});
		} else if (group) {
			//Only return the hash parameters for a particular group
			for (var k in parsed) {
				if (k.indexOf(group +'/') === 0) {
					values[k] = parsed[k];
				}
			}
 		} else {
 			//Return all the global hash parameters
 			for (var k in parsed) {
				if (k.indexOf('/') === -1) {
					values[k] = parsed[k];
				}
			}
 		}

		//Return the hashString
		if (single && Object.keys(values).length === 1){
			for (var kk in values) {
				return values[kk];
			}
		}
		return values;
	};



	/**
	 * Set one or more hash parameters
	 * @method
	 * @param {string|Object} params Either an encoded URI string or a key value object representing hash parameters and their respective values
	 * @param {string} [target] The hash string that is being updated - this will default to window.location.hash if omitted
	 * @param {Object} [opts] Some options
	 * @param {boolean} [opts.apply=false] If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method
	 * @param {boolean} [opts.replace=false] If true, replace URL instead of updating it, preventing a new history state from being recorded
	 * @param {boolean} [opts.retrunLiteral=false] If true, instead of returning the processed string, this function will return the object literal that it was compiled from
	 * @retrurn {Object} The new hash string
	*/
	Backbone.History.prototype.setHash = function(params, target, opts){
		//Sort parameters
		if (typeof target === 'object') {
			opts = target;
			target = null;
		}
		opts = opts || {};
		opts.apply = opts.apply || false;
		target = this.getHashString(target);
		params = (typeof params === 'string') ? this.parseHashString(params) : (params || '');

		//Parse existing hash string into its consituent parameters
		var existing = this.parseHashString(target);

		//Cycle through each provided parameter, and either update an old key or create a new one
		for (var k in params) {
			existing[k] = params[k];
		}

		//Set the new hashString
		var newHashString = this.setHashString(existing, opts);
		if (opts.returnLiteral) {
			return existing;
		}
		return newHashString;
	};



	/**
	 * Compare a hashString against the currently set one
	 * @method
	 * @param {string} stringA A hash string to try and match
	 * @param {string} [stringB] A hash string to try and match (defaults to the current window.location.hash)
	 * @retrurn {boolean} True if they match, false if they don't
	*/
	Backbone.History.prototype.matchHashString = function(stringA, stringB){
		if ( stringA === this.getHashString(stringB) ) {
			return true;
		}
		return false;
	};



	/**
	 * Take a hash string, and split it into its constituent parameters
	 * @method
	 * @param {string} [string] A hash string to parse, which will default wo window.location.hash if not provided
	 * @retrurn {Object} A key value object representing hash parameters and their respective decoded values
	*/
	Backbone.History.prototype.parseHashString = function(string){
		var hash = this.getHashString(string);

		//Make sure we have at least one useable hash value
		if (!hash.length || hash.indexOf('=') === -1) {
			return {};
		}

		//Extract all of the hash values
		var hashes = {}; hash = hash.split('&');
		hash.forEach(function(v){
			v = v.split('=');
			if (v.length === 2 && v[0].length && v[1].length) {
				hashes[v[0]] = decodeURIComponent(v[1]);
			} else if (v.length === 1 && v[0].length) {
				hashes[v[0]] = '';
			}
		});

		//Return the parsed hashes
		return hashes;
	};



	/**
	 * Grab the current hash string
	 * @method
	 * @param {Object} [string] A hash string to return, which will default to window.location.hash if not provided
	 * @retrurn {Object}The hash string, with the leading hash symbol symbol removed
	*/
	Backbone.History.prototype.getHashString = function(string){
		return (typeof string === 'string' ? string : this.getHash(window)).replace(/^#*/g, '');
	};



	/**
	 * Apply a new hash string
	 * @method
	 * @param {Object} params A set of key value pairs to combine into a single encoded string, which we can then set as the hash
	 * @param {Object} [opts] Some options
	 * @param {boolean} [opts.apply=false] If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method
	 * @param {boolean} [opts.replace=false] If true, replace URL instead of updating it, preventing a new history state from being recorded
	 * @retrurn {string} The resulting hash string
	*/
	Backbone.History.prototype.setHashString = function(params, opts){
		var encoded = [];
		if (params) {
			for (var k in params) {
				if (typeof params[k] === 'boolean' || typeof params[k] === 'number') {
					params[k] = params[k].toString();
				}
				if (typeof params[k] === 'string' && params[k].length) {
					encoded.push( k +'='+ encodeURIComponent(params[k]) );
				} else {
					encoded.push( k );
				}
			}
		}
		encoded = encoded && encoded.length ? encoded.join('&') : '';

		//Apply if necessary, and return
		opts = opts || {};
		if (opts.apply) {
			this._updateHash( (this.location || window.location), encoded, opts.replace);
			this.hashString = encoded;
		}
		return encoded;
	};

	return Backbone;
}));