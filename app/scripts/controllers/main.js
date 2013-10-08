'use strict';

angular.module('bloggerApp')
	.controller('MainCtrl', ['$scope', 'posts', 'BlogPosts', function ($scope, posts, BlogPosts) {
		$scope.posts = posts;

		$scope.deletePost = function(post) {
			BlogPosts.delete(post).then(function(response) {
				$scope.posts = response;
			}, function(response) {
				alert('could not delete post: ' + response.message);
			});
		}

		$scope.deleteAll = function() {
			BlogPosts.deleteAll().then(function(response) {
				$scope.posts = response;
			}, function(response) {
				alert('could not delete all posts: ' + response.message);
			});
		}
	}]);
