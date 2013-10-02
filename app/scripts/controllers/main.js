'use strict';

angular.module('bloggerApp')
	.controller('MainCtrl', function ($scope, posts) {
		$scope.posts = posts;
	});
