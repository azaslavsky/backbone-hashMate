## Warnings
Backbone.hashMate is, as of now, only compatible with [`pushState` friendly browsers](http://caniuse.com/#feat=history).  If your application targets browsers that do not have this capability (basically any IE before IE 10), you might want to avoid hashMate until we add support for older `hashChange` style browsers.

Some might also take issue with the fact that we [are "modifying" an object we do not own](http://www.nczonline.net/blog/2010/03/02/maintainable-javascript-dont-modify-objects-you-down-own/), namely `Backbone.History`.  This is true, but unavoidable.  Backbone automatically initializes a `Backbone.History` instance as soon as it loads called `Backbone.history`, which makes total sense, because a page could not possibly need more than one instance of history tracking.  This means that the page's native and already initialized history tracking is tied to the `Backbone.History` prototype.  To remedy this, we'd need to make a new class that inherits from `Backbone.History`, stop the already running `Backbone.history` instance, and start a new instance of `Backbone.OurClassThatInheritedFromHistory`.  This would be a nightmare for end users.  We'll just have to be vigilant about new versions of Backbone, and make sure that this library is still compatible.

## Tests

You can give test suite for hashMate a quick run through in the browser of your choice [here](http://cdn.rawgit.com/azaslavsky/backbone-hashMate/v0.1.0/test/jasmine.html).  You can also view results from local [Chrome tests](http://cdn.rawgit.com/azaslavsky/backbone-hashMate/master/test/results/spec/chrome.html), or the entire [browser compatibility suite](http://cdn.rawgit.com/azaslavsky/backbone-hashMate/master/test/results/spec/chrome.html).

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
