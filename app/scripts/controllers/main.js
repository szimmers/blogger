'use strict';

angular.module('bloggerApp')
	.controller('MainCtrl', function ($scope, posts) {
		alert('main: ' + JSON.stringify(posts));
		$scope.posts = posts;
	});
