'use strict';

describe('Controller: NewPostCtrl', function () {

	describe('when i post a new entry', function() {

		beforeEach(module('bloggerApp'));

		var NewpostCtrl, scope;

		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			NewpostCtrl = $controller('NewPostCtrl', {
				$scope: scope
			});
		}));

		it ('should route me to the main page', inject(function() {

		}));
	});
});
