(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([ "underscore", "backbone" ], function(_, Backbone) {
            return factory(root, Backbone, _);
        });
    } else if (typeof exports !== "undefined") {
        var _ = require("underscore"), Backbone = require("backbone");
        factory(root, Backbone, _);
        if (typeof module !== "undefined" && module.exports) {
            module.exports = Backbone;
        }
        exports = Backbone;
    } else {
        factory(root, root.Backbone, root._);
    }
})(this, function(root, Backbone, _) {
    "use strict";
    var start = Backbone.History.prototype.start;
    Backbone.History.prototype.start = function(options) {
        var prototype = this.prototype || this.__proto__;
        this.checkUrl = prototype.checkUrl.bind(this);
        options.hashChange = options.hashMate ? true : options.hashChange;
        this._hasHashMate = !!options.hashMate;
        this._noRootCheck = true;
        var loaded = start.call(this, options);
        delete this._noRootCheck;
        return loaded;
    };
    var atRoot = Backbone.History.prototype.atRoot;
    Backbone.History.prototype.atRoot = function() {
        if (this._hasHashMate && this._noRootCheck) {
            return false;
        } else {
            return atRoot.call(this);
        }
    };
    Backbone.History.prototype.checkUrl = function(e) {
        if (this.getFragment() === this.fragment && (this.hashString === this.getHashString() || !this._hasHashMate)) {
            return false;
        }
        this.hashString = this.getHashString();
        this.loadUrl();
    };
    var navigate = Backbone.History.prototype.navigate;
    Backbone.History.prototype.navigate = function(fragment, opts) {
        opts = opts || {};
        var hash = "";
        this.navigationInProgress = true;
        hash = opts.deleteHash && this.deleteHash(typeof opts.deleteHash === "object" ? _.extend(opts.deleteHash, {
            apply: false
        }) : {
            apply: false
        });
        hash = opts.deleteHash || opts.addHash ? this.setHash(opts.addHash, hash, {
            apply: true
        }) : this.getHashString(hash);
        if (opts.forceTrigger) {
            this.fragment = "";
        } else if (this.fragment === fragment && hash === this.hashString) {
            this.navigationInProgress = false;
            return;
        }
        navigate.call(this, fragment + "#" + hash, opts);
        this.hashString = hash;
        this.navigationInProgress = false;
    };
    Backbone.History.prototype.deleteHash = function(opts, target) {
        opts = opts || {};
        opts.apply = target ? false : typeof opts.apply === "boolean" ? opts.apply : true;
        opts.params = typeof opts.params === "string" ? [ opts.params ] : opts.params;
        opts.groups = typeof opts.groups === "string" ? [ opts.groups ] : opts.groups;
        opts.globals = typeof opts.globals === "string" ? [ opts.globals ] : opts.globals;
        var params = this.parseHashString(target);
        if (opts.groups || opts.globals || opts.params) {
            var groupsArray = opts.groups instanceof Array;
            var paramsArray = opts.params instanceof Array;
            var isGroup;
            for (var k in params) {
                isGroup = k.indexOf("/") > -1 ? true : false;
                if (!isGroup && opts.globals) {
                    delete params[k];
                } else if (isGroup && opts.groups) {
                    if (groupsArray && opts.groups.indexOf(k.split("/")[0]) === -1) {
                        continue;
                    }
                    delete params[k];
                } else if (paramsArray && opts.params.indexOf(k) !== -1) {
                    delete params[k];
                }
            }
            if (params && !Object.keys(params).length) {
                params = null;
            }
        } else {
            params = null;
        }
        return this.setHashString(params, opts);
    };
    Backbone.History.prototype.pluckHash = function(params, group) {
        var single = false;
        if (params && typeof params === "string") {
            single = true;
            params = [ params ];
        }
        var values = {}, parsed = this.parseHashString();
        if (params && params.length) {
            var mapped = [];
            params.forEach(function(v) {
                var key = v;
                if (!key.length) {
                    return;
                }
                if (v.indexOf("/") !== v.lastIndexOf("/")) {
                    return;
                }
                if (group && v.indexOf("/") === -1) {
                    key = group + "/" + v[0];
                }
                if (mapped.indexOf(key) === -1) {
                    mapped.push(key);
                }
            });
            mapped.forEach(function(v) {
                if (parsed[v]) {
                    values[v] = parsed[v];
                } else {
                    values[v] = "";
                }
            });
        } else if (group) {
            for (var k in parsed) {
                if (k.indexOf(group + "/") === 0) {
                    values[k] = parsed[k];
                }
            }
        } else {
            for (var k in parsed) {
                if (k.indexOf("/") === -1) {
                    values[k] = parsed[k];
                }
            }
        }
        if (single && Object.keys(values).length === 1) {
            for (var kk in values) {
                return values[kk];
            }
        }
        return values;
    };
    Backbone.History.prototype.setHash = function(params, target, opts) {
        if (typeof target === "object") {
            opts = target;
            target = null;
        }
        opts = opts || {};
        opts.apply = typeof opts.apply === "boolean" ? opts.apply : true;
        target = this.getHashString(target);
        params = typeof params === "string" ? this.parseHashString(params) : params || "";
        var existing = this.parseHashString(target);
        for (var k in params) {
            existing[k] = params[k];
        }
        var newHashString = this.setHashString(existing, opts);
        if (opts.returnLiteral) {
            return existing;
        }
        return newHashString;
    };
    Backbone.History.prototype.matchHashString = function(stringA, stringB) {
        if (stringA === this.getHashString(stringB)) {
            return true;
        }
        return false;
    };
    Backbone.History.prototype.parseHashString = function(string) {
        var hash = this.getHashString(string);
        if (!hash.length || hash.indexOf("=") === -1) {
            return {};
        }
        var hashes = {};
        hash = hash.split("&");
        hash.forEach(function(v) {
            v = v.split("=");
            if (v.length === 2 && v[0].length && v[1].length) {
                hashes[v[0]] = decodeURIComponent(v[1]);
            } else if (v.length === 1 && v[0].length) {
                hashes[v[0]] = "";
            }
        });
        return hashes;
    };
    Backbone.History.prototype.getHashString = function(string) {
        return (typeof string === "string" ? string : this.getHash(window)).replace(/^#*/g, "");
    };
    Backbone.History.prototype.setHashString = function(params, opts) {
        var encoded = [];
        if (params) {
            for (var k in params) {
                if (typeof params[k] === "boolean" || typeof params[k] === "number") {
                    params[k] = params[k].toString();
                }
                if (typeof params[k] === "string" && params[k].length) {
                    encoded.push(k + "=" + encodeURIComponent(params[k]));
                } else {
                    encoded.push(k);
                }
            }
        }
        encoded = encoded && encoded.length ? encoded.join("&") : "";
        opts = opts || {};
        if (opts.apply !== false) {
            this._updateHash(this.location || window.location, encoded, opts.replace);
            this.hashString = encoded;
        }
        return encoded;
    };
    return Backbone;
});