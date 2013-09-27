'use strict';

describe('Controller: MainCtrl', function () {

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
