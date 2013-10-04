'use strict';

angular.module('services.Blogger', ['services.CordovaAPI']);
//angular.module('services.Blogger', ['services.webapp']);
angular.module('services.CordovaAPI', ['services.Framework']);
//angular.module('services.webapp', ['services.Framework']);
angular.module('services.Framework', ['services.Cordova']);
angular.module('services.Cordova', []);

angular.module('bloggerApp', ['services.Blogger', 'services.Framework'])
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
						var deferred = $q.defer();

						Environment.waitForDeviceReady().then(function() {
							BlogPosts.get().then(function(response) {
								deferred.resolve(response);
							}, function(response) {
								var msg = 'could not get blog posts: ' + response.message;
								alert(msg);
								deferred.reject(msg);
							});
						}, function(response) {
							console.log(response.message);
							$location.path('/devicenotready');
							deferred.reject(response.message);
						});

						return deferred.promise;
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
