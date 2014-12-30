##API
###Backbone.History
An extended version of the default Backbone.History API


* [class: .History](#Backbone.History)
  * _instance_
    * [.start(options)](#Backbone.History#start)
    * [.navigate([fragment], [opts])](#Backbone.History#navigate)
    * [.deleteHash([opts], [target])](#Backbone.History#deleteHash) ⇒ <code>Object</code>
    * [.pluckHash([params], [group])](#Backbone.History#pluckHash) ⇒ <code>string</code> \| <code>Object</code>
    * [.setHash(params, [target], [opts])](#Backbone.History#setHash) ⇒ <code>Object</code>
    * [.matchHashString(stringA, [stringB])](#Backbone.History#matchHashString) ⇒ <code>boolean</code>
    * [.parseHashString([string])](#Backbone.History#parseHashString) ⇒ <code>Object</code>
    * [.getHashString([string])](#Backbone.History#getHashString) ⇒ <code>Object</code>
    * [.setHashString(params, [opts])](#Backbone.History#setHashString) ⇒ <code>string</code>

<a name="Backbone.History#start"></a>

* * *
####history.start(options)
Extension of the default startup functionality; wraps the default method, available at: http://backbonejs.org/#History-start

| Param | Type | Description |
| ----- | ---- | ----------- |
| options | <code>Object</code> | The default options object, but if both pushState and hashMate are true, it will enable router reaction to hash changes as well as popstate events |

<a name="Backbone.History#navigate"></a>

* * *
####history.navigate([fragment], [opts])
Extension of the default navigation functionality; wraps the default method, available at: http://backbonejs.org/#Router-navigate

| Param | Type | Description |
| ----- | ---- | ----------- |
| \[fragment\] | <code>string</code> | The new fragment |
| \[opts\] | <code>Object</code> | An extended version of the default options object, with the following properties available |
| \[opts.deleteHash=false\] | <code>boolean</code> \| <code>Object</code> | True means we reset the entire hash, false means that nothing is cleared |
| \[opts.deleteHash.globals=false\] | <code>boolean</code> \| <code>Array.&lt;string&gt;</code> | Setting true will clear all global variables, or an array can be specified for more granular deletion |
| \[opts.deleteHash.groups=false\] | <code>boolean</code> \| <code>Array.&lt;string&gt;</code> | Setting true will clear all prefixed variables, or an array can be specified for more granular deletion |
| \[opts.addHash\] | <code>string</code> \| <code>Object</code> | Either an encoded string or a key->value dictionary of hash parameters to be changed along with the fragment; this will be applied after the "clear" variables are processed |
| \[opts.forceTrigger=false\] | <code>boolean</code> | True forces a triggered URL to load, even if the URL matches the current one; only used it "opts.trigger" is also true |
| \[opts.replace=false\] | <code>boolean</code> | Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate |
| \[opts.trigger=false\] | <code>boolean</code> | Works exactly like the default "navigate" implementation, see http://backbonejs.org/#Router-navigate |

<a name="Backbone.History#deleteHash"></a>

* * *
####history.deleteHash([opts], [target]) ⇒ <code>Object</code>
Clear all or part of the hash

| Param | Type | Description |
| ----- | ---- | ----------- |
| \[opts\] | <code>Object</code> | No options means we clear the entire string |
| \[opts.params=false\] | <code>string</code> \| <code>Array.&lt;string&gt;</code> | A string, or an array of them, of specifying a parameter to clear |
| \[opts.groups=false\] | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>boolean</code> | True means clear all grouped parameters; can also be array of specific groups to clear |
| \[opts.globals=false\] | <code>boolean</code> | True means clear all global parameters |
| \[opts.apply=true\] | <code>boolean</code> | True means the actual window.location.hash will be cleared immediately; if opts.target is set, this will be forced into a false state |
| \[target\] | <code>string</code> | The hash string that is being updated - this will default to window.location.hash if omitted |

**Returns**: <code>Object</code> - The new hash string  
<a name="Backbone.History#pluckHash"></a>

* * *
####history.pluckHash([params], [group]) ⇒ <code>string</code> \| <code>Object</code>
Retrieve one or more hash parameters

| Param | Type | Description |
| ----- | ---- | ----------- |
| \[params\] | <code>Array.&lt;string&gt;</code> | A string or a list of parameters to extract; not providing it means all parameters (either global or of the requested group) will be returned |
| \[group\] | <code>Array.&lt;string&gt;</code> | A string that serves as the group prefix for all provided parameters - if parameters have their own prefix, it will be overridden! |

**Returns**: <code>string</code> \| <code>Object</code> - An object containing the requested hash parameters, or a single value if we only submit a single param  
<a name="Backbone.History#setHash"></a>

* * *
####history.setHash(params, [target], [opts]) ⇒ <code>Object</code>
Set one or more hash parameters

| Param | Type | Description |
| ----- | ---- | ----------- |
| params | <code>string</code> \| <code>Object</code> | Either an encoded URI string or a key value object representing hash parameters and their respective values |
| \[target\] | <code>string</code> | The hash string that is being updated - this will default to window.location.hash if omitted |
| \[opts\] | <code>Object</code> | Some options |
| \[opts.apply=true\] | <code>boolean</code> | If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method |
| \[opts.replace=false\] | <code>boolean</code> | If true, replace URL instead of updating it, preventing a new history state from being recorded |
| \[opts.retrunLiteral=false\] | <code>boolean</code> | If true, instead of returning the processed string, this function will return the object literal that it was compiled from |

**Returns**: <code>Object</code> - The new hash string  
<a name="Backbone.History#matchHashString"></a>

* * *
####history.matchHashString(stringA, [stringB]) ⇒ <code>boolean</code>
Compare a hashString against the currently set one

| Param | Type | Description |
| ----- | ---- | ----------- |
| stringA | <code>string</code> | A hash string to try and match |
| \[stringB\] | <code>string</code> | A hash string to try and match (defaults to the current window.location.hash) |

**Returns**: <code>boolean</code> - True if they match, false if they don't  
<a name="Backbone.History#parseHashString"></a>

* * *
####history.parseHashString([string]) ⇒ <code>Object</code>
Take a hash string, and split it into its constituent parameters

| Param | Type | Description |
| ----- | ---- | ----------- |
| \[string\] | <code>string</code> | A hash string to parse, which will default wo window.location.hash if not provided |

**Returns**: <code>Object</code> - A key value object representing hash parameters and their respective decoded values  
<a name="Backbone.History#getHashString"></a>

* * *
####history.getHashString([string]) ⇒ <code>Object</code>
Grab the current hash string

| Param | Type | Description |
| ----- | ---- | ----------- |
| \[string\] | <code>Object</code> | A hash string to return, which will default to window.location.hash if not provided |

**Returns**: <code>Object</code> - The hash string, with the leading hash symbol symbol removed  
<a name="Backbone.History#setHashString"></a>

* * *
####history.setHashString(params, [opts]) ⇒ <code>string</code>
Apply a new hash string

| Param | Type | Description |
| ----- | ---- | ----------- |
| params | <code>Object</code> | A set of key value pairs to combine into a single encoded string, which we can then set as the hash |
| \[opts\] | <code>Object</code> | Some options |
| \[opts.apply=true\] | <code>boolean</code> | If true, we'll just set the window.location.hash variable directly; otherwise, that responsibility falls to whatever function called this method |
| \[opts.replace=false\] | <code>boolean</code> | If true, replace URL instead of updating it, preventing a new history state from being recorded |

**Returns**: <code>string</code> - The resulting hash string  
