'use strict';

describe('Controller: MainCtrl', function () {

	describe('when the controller is loaded', function() {

		// load the controller's module
		beforeEach(module('bloggerApp'));

		var MainCtrl,
			scope;

		// Initialize the controller and a mock scope
		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			var posts = [
				{'uniqueId':1, 'creationDate': '2013-08-10', 'entry':'i like soup'},
				{'uniqueId':2, 'creationDate': '2013-08-10', 'entry':'soup is good food.'},
				{'uniqueId':3, 'creationDate': '2013-08-08', 'entry':'some hats are shaped like oklahoma\nsome hats are shaped like the Zuiderzee!'}
			];

			MainCtrl = $controller('MainCtrl', {
				$scope: scope,
				posts: posts
			});
		}));

		it('should attach the post list to the scope', function () {
			expect(scope.posts.length).toBe(3);
		});
	});

	describe('when i want to delete posts', function() {

		// load the controller's module
		beforeEach(module('bloggerApp'));

		var MainCtrl,
			scope,
			posts = [];

		// mock for BlogPost service
		beforeEach(function () {

			var deleteDeferred;

			var mockBlogPostService = {
				delete: function(post) {
					// don't really care which one we delete, just need to delete one
					posts.pop();
					deleteDeferred.resolve(posts);
					return deleteDeferred.promise;
				},
				deleteAll: function() {
					posts.length = 0;
					deleteDeferred.resolve(posts);
					return deleteDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('BlogPosts', mockBlogPostService);
			});

			inject(function($q) {
				deleteDeferred = $q.defer();
			})
		});

		// Initialize the controller and a mock scope
		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			posts = [
				{'uniqueId':1, 'creationDate': '2013-08-10', 'entry':'i like soup'},
				{'uniqueId':2, 'creationDate': '2013-08-10', 'entry':'soup is good food.'},
				{'uniqueId':3, 'creationDate': '2013-08-08', 'entry':'some hats are shaped like oklahoma\nsome hats are shaped like the Zuiderzee!'}
			];

			MainCtrl = $controller('MainCtrl', {
				$scope: scope,
				posts: posts
			});
		}));

		it('deleting a single post should result in 1 fewer posts', function () {
			scope.deletePost(posts[0]);

			scope.$apply();

			expect(scope.posts.length).toBe(2);
		});

		it('deleting all the posts should result in 0 posts', function () {
			scope.deleteAll();

			scope.$apply();

			expect(scope.posts.length).toBe(0);
		});
	});

	describe('when i want to delete posts', function() {

		// load the controller's module
		beforeEach(module('bloggerApp'));

		var MainCtrl,
			scope;

		// mock for BlogPost service
		beforeEach(function () {

			var deleteDeferred;

			var mockBlogPostService = {
				delete: function(post) {
					// don't really care which one we delete, just need to delete one
					deleteDeferred.reject('cannot delete');
					return deleteDeferred.promise;
				},
				deleteAll: function() {
					deleteDeferred.reject('cannot delete');
					return deleteDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('BlogPosts', mockBlogPostService);
			});

			inject(function($q) {
				deleteDeferred = $q.defer();
			})
		});

		// Initialize the controller and a mock scope
		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();

			var posts = [];

			MainCtrl = $controller('MainCtrl', {
				$scope: scope,
				posts: posts
			});
		}));

		it('failure to delete a single post should result in an alert', function () {
			spyOn(window, "alert");
			scope.deletePost({});

			scope.$apply();

			expect(window.alert).toHaveBeenCalled();
		});

		it('failure to delete all posts should result in an alert', function () {
			spyOn(window, "alert");
			scope.deleteAll();

			scope.$apply();

			expect(window.alert).toHaveBeenCalled();
		});
	});

});
