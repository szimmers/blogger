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
					posts: ['Environment', 'BlogPosts', '$q', '$location', function(Environment, BlogPosts, $q, $location) {
						if (Environment.isNative() === false) {
							return BlogPosts.get();
						}
						else {
							var deferred = $q.defer();

							Environment.waitForDeviceReady().then(function() {
								BlogPosts.get().then(function(response) {
									deferred.resolve(response);
								}, function(response) {
									alert('could not get blog posts: ' + response.message);
								});
							}, function(response) {
								console.log(response.message);
								$location.path('/devicenotready');
								deferred.reject(response.message);
							});

							return deferred.promise;
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
