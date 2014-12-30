# backbone-hashMate
=================
[![License](https://img.shields.io/cocoapods/l/AFNetworking.svg)](https://github.com/azaslavsky/TextStack#license) [![Bower version](https://badge.fury.io/bo/backbone-hashmate.svg)](http://badge.fury.io/bo/backbone-hashmate) [![npm version](https://badge.fury.io/js/backbone-hashmate.svg)](http://badge.fury.io/js/backbone-hashmate) [![Coverage Status](https://img.shields.io/coveralls/azaslavsky/backbone-hashMate.svg)](https://coveralls.io/r/azaslavsky/backbone-hashMate?branch=master) [![Dependencies](https://david-dm.org/azaslavsky/backbone-hashMate/status.svg)](https://david-dm.org/azaslavsky/backbone-hashMate#info=dependencies&view=table) [![Travis Build](https://api.travis-ci.org/azaslavsky/backbone-hashMate.svg)](https://travis-ci.org/azaslavsky/backbone-hashMate) 

__[Check out the demo!](azaslavsky.github.io/backbone-hashMate/demo)__

Like [jQuery BBQ](http://benalman.com/projects/jquery-bbq-plugin/), but for Backbone.  HashMate extends Backbone.History to store and respond to information contained in the URL's hash fragment.  Useful for state management, referral handling, history, SEO, and more.

## Jump To
* [Description](#description)
* [Installation](#installation)
* [Demo](#demo)
* [Usage](#usage)
* [API](#api)
* [Warnings](#warnings)
* [Tests](#tests)
* [Contributing](#contributing)
* [License](#license)

## Description

The purpose of backbone-hashMate is to save information about the position (or state) of either a given resource, or an entire document.  This is most useful in single page apps using something similar to `pushState` to manage history, where over the course of loading many distinct paths, a "backlog" of resource specific and global states might build up that may be useful to save between disparate instances.

For example, suppose that you operate some sort of single page news app at `mynewsapp.com`.  A user has landed on your page, and clicks over to an article, located at `mynewsapp.com/article/1234`.  They then click on a picture in the article, thereby maximizing it.  Then they click on a "share" button below the maximized picture, in order to send that to a friend.  How could we communicate this state - that the picture is maximized, and that it was shared by user XYZ?  Of course, we could make a unique path fragment for this, something like `mynewsapp.com/article/1234/picture/1?referrer=XYZ`, but this carries the risk of hurting SEO by creating [duplicate content](http://moz.com/learn/seo/duplicate-content), not to mention muddling resource state into the path fragment.

A better way is to put all of this extra state and location information in the hash.  Our example above could be rewritten like `mynewsapp.com/article/1234#article/picture=1234&&referrer=XYZ`.  Now, the information in the hash fragment is [opaque to crawlers like Google](http://www.oho.com/blog/explained-60-seconds-hash-symbols-urls-and-seo).  Using this format creates a logical separation between _unique resources_ (path fragments), and the _states and locations within those resources_ (hashes).  Backbone.hashMate streamlines this process for Backbone apps.

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

## Demo
You can check out a working demo at [azaslavsky.github.io/backbone-hashMate/demo](azaslavsky.github.io/backbone-hashMate/demo).  While this works fine, there is a drawback: since gitbhub pages don't support aliases by default, the only entry point to the single page demo app is at `/backbone-hashMate/demo`.  URLs like `/backbone-hashMate/demo/article/Some_Title` and `/backbone-hashMate/demo/options` return a 404, even though there is routing support for them.

A better way to fire up the demo is to install the repository locally, then run the following in the CLI:

```
node demo/server.js
```

Then, point your browser to `localhost:4040/backbone-hashMate/demo`, or any of the other valid paths mentioned above.