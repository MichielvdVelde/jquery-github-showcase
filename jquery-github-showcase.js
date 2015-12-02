(function($) {

	$.fn.gh_showcase = function(options) {

		var el = this;
		options = $.extend({
			'baseUrl': 'https://api.github.com',
			'cacheTime': 24,
			'render': (Mustache) ? Mustache.render : null
		}, options);

		/**
		 * Load repositories either from cache (if it's still fresh)
		 * or from the Github API
		*/
		var loadRepositories = function(callback) {
			var cacheDate = (options.cacheTime === 0) ? (new Date()).getTime() : localStorage.getItem('gh-showcase.' + options.username + '.time') || (new Date()).getTime() - (options.cacheTime + 1) * 3600000;
			var cacheExpired = (new Date()).getTime() - cacheDate > options.cacheTime * 3600000;
			if(cacheExpired)
				return fetchRepositoriesFromGithub(callback);
			return fetchRepositoriesFromStorage(callback);
		};

		/**
		 * Fetch user repositories from Github
		*/
		var fetchRepositoriesFromGithub = function(callback) {
			$.getJSON(options.baseUrl + '/users/' + options.username + '/repos?sort=' + ((options.sort) ? options.sort : 'updated'), function(repos) {
				cacheRepositories(repos);
				return callback(repos);
			});
		};

		/**
		 * Fetch user repositories from cache
		*/
		var fetchRepositoriesFromStorage = function(callback) {
			var repos = localStorage.getItem('gh-showcase.' + options.username + '.repos') || '[]';
			return callback(JSON.parse(repos));
		};

		/**
		 * Cache repositories
		*/
		var cacheRepositories = function(repos) {
			localStorage.setItem('gh-showcase.' + options.username + '.time', (new Date()).getTime());
			localStorage.setItem('gh-showcase.' + options.username + '.repos', JSON.stringify(repos));
		};

		/**
		 * Load a template from a remote source
		*/
		var loadTemplate = function(cb) {
			$.ajax({
				'type': 'GET',
				'url': options.templateUrl,
				'dataType': 'html'
			}).done(function(template) {
				options.template = template;
				return cb();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				return cb(errorThrown);
			});
		};

		/**
		 * Render all repositories to the screen
		*/
		var renderRepositories = function() {
			loadRepositories(function(repos) {
				$.each(repos, function(key, repo) {
					if(typeof options.transform == 'function')
						repo = options.transform(repo);
					var rendered = options.render(options.template, repo);
					$(rendered).appendTo(el);
				});
			});
		};

		if(options.templateUrl) {
			return loadTemplate(function(error) {
				if(error || !options.template) return console.error(error || 'Invalid template');
				renderRepositories();
			});
		}
		renderRepositories();

	};

})(jQuery);
