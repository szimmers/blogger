'use strict';

describe('Service: BlogPostService', function () {

	describe('when i need posts', function() {
		beforeEach(module('bloggerApp'));
		beforeEach(module('services.Blogger'));

		var service, scope;

		// mock for Storage service
		beforeEach(function () {

			var getDeferred, saveDeferred, savedPosts = [];

			var mockStorageService = {
				get: function(PACKAGE_PATH, APP_NAME) {
					getDeferred.resolve(savedPosts);
					return getDeferred.promise;
				},
				save: function (PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post) {
					savedPosts.push(post);
					saveDeferred.resolve(post);
					return saveDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('Storage', mockStorageService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
				saveDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('BlogPosts');

			service.create('i like soup.');
			service.create('soup is good food.');
		}));

		it('should return them', inject(function () {

			service.get().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(2);
		}));

	});

	describe('when i create a post', function() {
		beforeEach(module('bloggerApp'));
		beforeEach(module('services.Blogger'));

		var service, scope;

		// mock for Storage service
		beforeEach(function () {

			var getDeferred, saveDeferred, savedPosts = [];

			var mockStorageService = {
				get: function(PACKAGE_PATH, APP_NAME) {
					getDeferred.resolve(savedPosts);
					return getDeferred.promise;
				},
				save: function (PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post) {
					savedPosts.push(post);
					saveDeferred.resolve(post);
					return saveDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('Storage', mockStorageService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
				saveDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('BlogPosts');
		}));

		it('should be available in the get', inject(function () {

			var entry = 'i like soup.';

			service.create(entry).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data[0].entry).toEqual(entry);
		}));

	});

	describe('when i want to delete', function() {
		beforeEach(module('bloggerApp'));
		beforeEach(module('services.Blogger'));

		var service, scope, savedPosts = [];

		// mock for Storage service
		beforeEach(function () {

			var getDeferred, saveDeferred, deleteDeferred;

			var mockStorageService = {
				get: function(PACKAGE_PATH, APP_NAME) {
					getDeferred.resolve(savedPosts);
					return getDeferred.promise;
				},
				save: function (PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post) {
					savedPosts.push(post);
					saveDeferred.resolve(post);
					return saveDeferred.promise;
				},
				// for convenience, just delete one that's easy to get to, instead
				// of searching
				delete: function (PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post) {
					savedPosts.pop();
					deleteDeferred.resolve(post);
					return deleteDeferred.promise;
				},
				deleteAll: function (PACKAGE_PATH, APP_NAME) {
					savedPosts.length = 0;
					deleteDeferred.resolve([]);
					return deleteDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('Storage', mockStorageService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
				saveDeferred = $q.defer();
				deleteDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('BlogPosts');

			service.create('i like soup.');
			service.create('soup is good food.');
			service.create('mmmm... soup.');
		}));

		it('deleting a single post should return the remainder', inject(function () {

			var post = savedPosts[0];

			service.delete(post).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(2);
		}));

		it('deleting all the posts should return an empty list', inject(function () {

			service.deleteAll().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(0);
		}));

	});

});
