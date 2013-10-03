'use strict';

angular.module('bloggerApp')
	.controller('MainCtrl', function ($scope, posts, BlogPosts) {
		$scope.posts = posts;

		$scope.deletePost = function(post) {
			BlogPosts.delete(post).then(function(response) {
				$scope.posts = response;
			}, function(response) {
				alert('could not delete post: ' + response.message);
			});
		}
	});
