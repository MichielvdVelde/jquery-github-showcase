# jquery-github-showcase

This is a handy and simple to use jQuery plugin for showcasing your (or anyone else's) repositories on your own web site. It simply fetches the repositories from the Github API and you can add custom styling with templates and more.

The code is completely client-side and has built-in client-side caching using `localStorage` if available (but can be customized, see below).

It provides a rendering-agnostic interface with an optional `tranform` method. All properties from [the Github API Repositories](https://developer.github.com/v3/repos/#list-user-repositories) are available for use.

A demo is available [here](http://jquery-github-showcase.artofcoding.nl/), and you can also [read the blog post](http://blog.artofcoding.nl/github-repositories-in-jquery/).

# Install

```
bower install jquery-github-showcase
```

# Usage

	<script src="js/jquery-github-showcase.js"></script>

Now you can start the plugin:

```js
$(document).ready(function() {
	$('#my-showcase').gh_showcase({
		'username': 'MichielvdVelde',
		'templateUrl': 'templates/github.tpl',
		'renderer': Mustache.render,
		'store': localStorage,
		'transform': function(repo) {
			// Use this method to transform repo properties when necessary
			// In this case, convert the date to dd-mm-YYYY
			var updated_at = new Date(repo.updated_at);
			repo.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() +1) + '-' + updated_at.getFullYear();
			return repo;
		}
	});
});
```

## Options

* `username`: The user name to load the repositories for (required)
* `sort`: The field to sort on (see Github API, default 'pushed')
* `direction`: The direction of the sort, either `desc` (default) or `asc`
* `template`: The template to use for rendering (this or `templateUrl` is required)
* `templateUrl`: The URL of the template to use for rendering (this or `template` is required)
* `cacheTime`: The cache time in hours. Defaults to 24h. Disable caching by setting `cacheTime` to 0
* `renderer` (**replaces `render`**): The render method. Should take `(template, scope)`. If no renderer is set, an error will be generated
* `store`: The cache store to use. Should have `setItem(key, value)` and `getItem(key)`. If no store is set, an error will be generated
* `transform`: An optional method to transform properties. See the example above

If both `template` and `templateUrl` are set, `templateUrl` takes precedence.

Another option is to just store the data in `sessionStorage`. This way you can disable the cache by setting `cacheTime` to `0`.

## To do

* Publish on Bower and stuff

## Changelog

* 6 December 2015
  * v0.0.3 - Published on Bower
  * Updated readme with **breaking changes**
  * Changed `options.render` to `options.renderer`
  * `Mustache` and `localStorage` are **not** included by default anymore. `options` must now have these two defined!
  * Rewrote cache expiry code
  * Fixed Github repository URL
* 3 December 2015
  * Make cache store type available in options
* 2 December 2015
  * Change `sort` default from `updated` to `pushed`
  * Add `options.direction`
  * First commit

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
