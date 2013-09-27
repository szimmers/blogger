'use strict';

describe('Service: BlogPostService', function () {

	describe('when i need posts', function() {
		beforeEach(module('bloggerApp'));
		beforeEach(module('services'));

/*
		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});
		*/

		var service, $httpBackend, scope, posts;

		beforeEach(inject(function ($injector, $rootScope/*, BASE_URL*/) {

			posts = [
				{'uniqueId':1, 'creationDate': '2013-08-10', 'entry':'i like soup'},
				{'uniqueId':2, 'creationDate': '2013-08-10', 'entry':'soup is good food.'},
				{'uniqueId':3, 'creationDate': '2013-08-08', 'entry':'some hats are shaped like oklahoma\nsome hats are shaped like the Zuiderzee!'}
			];

/*
			var url = BASE_URL + '/services/project/';

			$httpBackend = $injector.get('$httpBackend');
			$httpBackend.expectGET(url).respond(200, projects);
 */

			scope = $rootScope.$new();

			service = $injector.get('BlogPosts');
		}));

		it('should return the blog posts', inject(function () {

			var promise = service.get().then(function(response) {
				scope.data = response;
			});

			//$httpBackend.flush();
			scope.$apply();

			expect(scope.data).toEqual(posts);
		}));

		it('should return the post by id', inject(function () {

			var promise = service.getById(1).then(function(response) {
				scope.data = response;
			});

			//$httpBackend.flush();
			scope.$apply();

			expect(scope.data).toEqual(posts[0]);
		}));
	});
});
