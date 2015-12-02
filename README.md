# jquery-github-showcase

This is a handy and simple to use jQuery plugin for showcasing your (or anyone else's) repositories on your own web site. It simply fetches the repositories from the Github API and you can add custom styling with templates and more.

The code is completely client-side and has built-in client-side caching using `localStorage`.

It provides a rendering-agnostic interface with an optional `tranform` method. All properties from [the Github API](https://developer.github.com/v3/repos/#list-user-repositories) are available for use.

A demo is available [here](http://jquery-github-showcase.artofcoding.nl/).

# Install

For now you'll have to do it yourself. Download the source and extract it somewhere, for example to your `js/` directory.

# Usage

	<script src="js/jquery-github-showcase.js"></script>

Now you can start the plugin:

```js
$(document).ready(function() {
	$('#my-showcase').gh_showcase({
		'username': 'MichielvdVelde',
		'templateUrl': 'templates/github.tpl',
		'transform': function(repo) {
			// Use this method to transform repo properties when necessary
			// In this case, convert the date to dd-mm-YYYY
			// And remove '{/number}' from the issues URL
			var updated_at = new Date(repo.updated_at);
			repo.updated_at = updated_at.getDate() + '-' + (updated_at.getMonth() +1) + '-' + updated_at.getFullYear();
			repo.issues_url = repo.issues_url.substr(0, repo.issues_url.length - 9);
			return repo;
		}
	});
});
```

## Options

* `username`: The user name to load the repositories for (required)
* `sort`: The field to sort on (see Github API, default 'updated')
* `template`: The template to use for rendering (this or `templateUrl` is required)
* `templateUrl`: The URL of the template to use for rendering (this or `template` is required)
* `cacheTime`: The cache time in hour. Defaults to 24h. Disable caching by setting `cacheTime` to 0
* `render`: The render method. Defaults to `Mustache.render` (if available), otherwise is not set. Any other method must take the same arguments
* `transform`: An optional method to transform properties. See the example abocve

If both `template` and `templateUrl` are set, `templateUrl` takes precedence.

## To do

* Improve render method handling (remove Mustache references from core code)
* Publish on Bower and stuff

## Changelog

* 0.0.1 - 2 December 2015
  * First commit

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
