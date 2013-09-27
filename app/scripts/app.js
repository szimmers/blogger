'use strict';

angular.module('bloggerApp', ['services.BlogPostService', 'services.EnvironmentServiceProvider', 'services.EnvironmentService'])
	/**
	 * when first run, determine if we're native or not and set it on root scope
	 */
	.run(function ($rootScope, EnvironmentProvider) {
		var isNative = EnvironmentProvider.isNative();
		$rootScope.isNative = isNative;
	})

	/**
	 * route config
	 */
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				resolve: {
					// for main page only, ensure device is ready before resolving (if on a device)
					posts: ['Environment', 'BlogPosts', '$location', function(Environment, BlogPosts, $location) {
						if (Environment.isNative() === false) {
							return BlogPosts.get();
						}
						else {
							Environment.waitForDeviceReady().then(function() {
								return BlogPosts.get();
							}, function(response) {
								console.log(response.message);
								$location.path('/devicenotready');
								return null;
							});
						}
					}]
				}
			})
			.when('/new', {
				templateUrl: 'views/newPost.html',
				controller: 'NewPostCtrl'
			})
			.when('/devicenotready', {
				templateUrl: 'views/deviceNotReady.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	});
