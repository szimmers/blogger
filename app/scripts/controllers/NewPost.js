'use strict';

angular.module('bloggerApp')
	.controller('NewPostCtrl', function ($scope, $location, BlogPosts) {
		$scope.postNewEntry = function() {
			BlogPosts.create($scope.entry).then(function() {
				$location.path('/');
			}, function() {
				alert('Could not save entry');
			});
		};
	});
