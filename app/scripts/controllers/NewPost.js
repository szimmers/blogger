'use strict';

angular.module('bloggerApp')
	.controller('NewPostCtrl', ['$scope', '$location', 'BlogPosts', function ($scope, $location, BlogPosts) {
		$scope.postNewEntry = function() {
			BlogPosts.create($scope.entry).then(function() {
				$location.path('/');
			}, function(response) {
				alert('Could not save entry: ' + response.message);
			});
		};
	}]);
