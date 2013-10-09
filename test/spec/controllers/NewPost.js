'use strict';

describe('Controller: NewPostCtrl', function () {

	describe('when i post a new entry', function() {

		beforeEach(module('bloggerApp'));

		var NewpostCtrl, scope, location;

		// mock for BlogPost service
		beforeEach(function () {

			var getDeferred, saveDeferred, savedPosts = [];

			var mockBlogPostService = {
				get: function() {
					getDeferred.resolve(savedPosts);
					return getDeferred.promise;
				},
				create: function(entry) {
					savedPosts.push(entry);
					saveDeferred.resolve(entry);
					return saveDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('BlogPosts', mockBlogPostService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
				saveDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($controller, $rootScope, $location) {

			scope = $rootScope.$new();

			location = $location;

			NewpostCtrl = $controller('NewPostCtrl', {
				$scope: scope
			});
		}));

		it ('should route me to the main page', inject(function() {

			scope.entry = "I like soup.";

			scope.postNewEntry();

			scope.$apply();

			expect(location.path()).toBe('/');
		}));
	});

	describe('when the system cannot post a new entry', function() {

		beforeEach(module('bloggerApp'));

		var NewpostCtrl, scope, location;

		// mock for BlogPost service
		beforeEach(function () {

			var saveDeferred;

			var mockBlogPostService = {
				create: function(entry) {
					saveDeferred.reject('some random issue');
					return saveDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('BlogPosts', mockBlogPostService);
			});

			inject(function($q) {
				saveDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($controller, $rootScope, $location) {

			scope = $rootScope.$new();

			location = $location;

			NewpostCtrl = $controller('NewPostCtrl', {
				$scope: scope
			});
		}));

		it ('should keep me on the same page', inject(function() {

			scope.entry = "I like soup.";

			scope.postNewEntry();

			scope.$apply();

			expect(location.path()).not.toBe('/');
		}));
	});
});
