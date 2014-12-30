##API
###Backbone.History
An extended version of the default Backbone.History API

**Members**

* [class: Backbone.History](#Backbone.History)
  * [history.start(options)](#Backbone.History#start)
  * [history.navigate([fragment], [opts])](#Backbone.History#navigate)
  * [history.deleteHash([opts], [target])](#Backbone.History#deleteHash)
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

- options `Object` - The default options object, but if both pushState and hashMate are true, it will enable router reaction to hash changes as well as popstate events  

<a name="Backbone.History#navigate"></a>

* * *
####history.navigate([fragment], [opts])
Extension of the default navigation functionality; wraps the default method, available at: http://backbonejs.org/#Router-navigate

**Params**

- \[fragment\] `string` - The new fragment  
- \[opts\] `Object` - An extended version of the default options object, with the following properties available  
  - \[deleteHash=false\] `boolean` | `Object` - True means we reset the entire hash, false means that nothing is cleared  
  - \[globals=false\] `boolean` | `Array.<string>` - Setting true will clear all global variables, or an array can be specified for more granular deletion  
  - \[groups=false\] `boolean` | `Array.<string>` - Setting true will clear all prefixed variables, or an array can be specified for more granular deletion  
  - \[addHash\] `string` | `Object` - Either an encoded string or a key->value dictionary of hash parameters to be changed along with the fragment; this will be applied after the "clear" variables are processed  
  - \[forceTrigger=false\] `boolean` - True forces a triggered URL to load, even if the URL matches the current one; only used it "opts.trigger" is also true  
  - \[replace=false\] `boolean` - Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate  
  - \[trigger=false\] `boolean` - Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate  

<a name="Backbone.History#deleteHash"></a>

* * *
####history.deleteHash([opts], [target])
Clear all or part of the hash

**Params**

- \[opts\] `Object` - No options means we clear the entire string  
  - \[params=false\] `string` | `Array.<string>` - A string, or an array of them, of specifying a parameter to clear  
  - \[groups=false\] `string` | `Array.<string>` | `boolean` - True means clear all grouped parameters; can also be array of specific groups to clear  
  - \[globals=false\] `boolean` - True means clear all global parameters  
  - \[apply=true\] `boolean` - True means the actual window.location.hash will be cleared immediately; if opts.target is set, this will be forced into a false state  
- \[target\] `string` - The hash string that is being updated - this will default to window.location.hash if omitted  

**Returns**: `Object` - The new hash string  
<a name="Backbone.History#pluckHash"></a>

* * *
####history.pluckHash([params], [group])
Retrieve one or more hash parameters

**Params**

- \[params\] `Array.<string>` - A string or a list of parameters to extract; not providing it means all parameters (either global or of the requested group) will be returned  
- \[group\] `Array.<string>` - A string that serves as the group prefix for all provided parameters - if parameters have their own prefix, it will be overridden!  

**Returns**: `string` | `Object` - An object containing the requested hash parameters, or a single value if we only submit a single param  
<a name="Backbone.History#setHash"></a>

* * *
####history.setHash(params, [target], [opts])
Set one or more hash parameters

**Params**

- params `string` | `Object` - Either an encoded URI string or a key value object representing hash parameters and their respective values  
- \[target\] `string` - The hash string that is being updated - this will default to window.location.hash if omitted  
- \[opts\] `Object` - Some options  
  - \[apply=true\] `boolean` - If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method  
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
  - \[apply=true\] `boolean` - If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method  
  - \[replace=false\] `boolean` - If true, replace URL instead of updating it, preventing a new history state from being recorded  

**Returns**: `string` - The resulting hash string  
