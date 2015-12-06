(function($) {

	$.fn.gh_showcase = function(options) {

		var el = this;
		options = $.extend({
			'baseUrl': 'https://api.github.com',
			'cacheTime': 24,
			'sort': 'pushed',
			'direction': 'desc'
		}, options);

		// First check if options.renderer and options.store are set
		if(options.render) {
			// For backwards compatibility
			if(options.render.render && typeof options.render.render == 'function')
				options.renderer = options.render.render;
			else
				options.renderer = options.render;
		}
		if(!options.renderer || !options.store) {
			return console.error('Missing renderer or store');
		}

		/**
		 * Returns true if the cache is expired
		*/
		var cacheExpired = function() {
			var cacheDate = options.store.getItem('gh-showcase.' + options.username + '.time') || null;
			if(!options.cacheTime || options.cacheTime === 0 || cacheDate === null)
				return true;
			return ((new Date()).getTime() - cacheDate) > (options.cacheTime * 3600000);
		};

		/**
		 * Load repositories either from cache (if it's still fresh)
		 * or from the Github API
		*/
		var loadRepositories = function(callback) {
			if(cacheExpired())
				return fetchRepositoriesFromGithub(callback);
			return fetchRepositoriesFromStorage(callback);
		};

		/**
		 * Fetch user repositories from Github
		*/
		var fetchRepositoriesFromGithub = function(callback) {
			var url = options.baseUrl + '/users/' + options.username + '/repos?sort=' + options.sort + '&direction=' + options.direction;
			$.getJSON(url, function(repos) {
				cacheRepositories(repos);
				return callback(repos);
			});
		};

		/**
		 * Fetch user repositories from cache
		*/
		var fetchRepositoriesFromStorage = function(callback) {
			var repos = options.store.getItem('gh-showcase.' + options.username + '.repos') || '[]';
			return callback(JSON.parse(repos));
		};

		/**
		 * Cache repositories
		*/
		var cacheRepositories = function(repos) {
			options.store.setItem('gh-showcase.' + options.username + '.time', (new Date()).getTime());
			options.store.setItem('gh-showcase.' + options.username + '.repos', JSON.stringify(repos));
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
					var rendered = options.renderer(options.template, repo);
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
