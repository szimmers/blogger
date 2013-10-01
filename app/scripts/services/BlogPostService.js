'use strict';

angular.module('services.BlogPostService', ['services.StorageService'])
	.constant('PACKAGE_PATH', 'net.digitalprimates')
	.constant('APP_NAME', 'blogger3')
	.constant('KEY_FIELDNAME', 'uniqueId')
	.service('BlogPosts', function ($http, $q, Storage, PACKAGE_PATH, APP_NAME, KEY_FIELDNAME) {
		// get stores the posts for later retrieval by id
		var _posts = null;

		/**
		 * given an id, finds the matching post from the previously loaded posts.
		 * @param postId
		 * @returns {*}
		 * @private
		 */
		var _getById = function(postId) {
			var i, len;

			for (i=0, len = _posts.length; i < len; i++) {
				var post = _posts[i];

				if ((post !== null) && (post.uniqueId == postId)) {
					return post;
				}
			}
		};

		/**
		 * given some user-defined text, create and return a blog post
		 */
		var _createPostFromEntry = function(entry) {
			// uniqueId is our key for storage, they need to be unique
			var uniqueId = Math.floor((Math.random() * 10000) + 1);
			var newPost = {'entry': entry, 'creationDate': new Date(), 'uniqueId': uniqueId};

			return newPost;
		};

		return {
			/**
			 * returns a list of posts available to the user
			 * @returns {*}
			 */
			get: function() {
				var deferred = $q.defer();

				if (_posts === null) {
					Storage.get(PACKAGE_PATH, APP_NAME, KEY_FIELDNAME).then(function(response) {
						//alert('fulfilled 2:' + response);
						_posts = response;
						deferred.resolve(_posts);
					}, function() {
						_posts = [];
						deferred.resolve([]);
					});
				}
				else {
					deferred.resolve(_posts);
				}

				return deferred.promise;
			},
			/**
			 * given an id, returns the matching post
			 * @param postId
			 * @returns {*}
			 */
			getById: function(postId) {
				var deferred = $q.defer(),
					post;

				if (_posts === null) {
					this.get().then(function() {
						post = _getById(postId);
						deferred.resolve(post);
					});
				}
				else {
					post = _getById(postId);
					deferred.resolve(post);
				}

				return deferred.promise;
			},
			/**
			 * creates a new blog entry
			 * @param entry
			 * @returns {*}
			 */
			create: function(entry) {
				var that = this;
				var post = _createPostFromEntry(entry);

				return Storage.save(PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post).then(function(response) {
					if (_posts === null) {
						that.get().then(function() {
							_posts.push(response);
							return _posts;
						});
					}
					else {
						_posts.push(response);
						return _posts;
					}
				}, function(response) {
					console.log(response.message);
				});
			}
		};
	});
