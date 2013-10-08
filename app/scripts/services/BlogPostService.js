'use strict';

angular.module('services.Blogger')
	/**
	 * defines the package for the app for storage
	 */
	.constant('PACKAGE_PATH', 'net.digitalprimates')

	/**
	 * defines the name the app for storage
	 */
	.constant('APP_NAME', 'blogger3')

	/**
	 * defines the name of the field in the data which storage will use for keying off of
	 */
	.constant('KEY_FIELDNAME', 'uniqueId')

	/**
	 * service for creating, getting, saving blog posts
	 */
	.service('BlogPosts', ['$http', '$q', 'Storage', 'PACKAGE_PATH', 'APP_NAME', 'KEY_FIELDNAME',
		function ($http, $q, Storage, PACKAGE_PATH, APP_NAME, KEY_FIELDNAME) {

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

				Storage.get(PACKAGE_PATH, APP_NAME).then(function(response) {
					deferred.resolve(response);
				}, function() {
					deferred.resolve([]);
				});

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

				var deferred = $q.defer();

				Storage.save(PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post).then(function() {
					Storage.get(PACKAGE_PATH, APP_NAME).then(function(response) {
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			},

			/**
			 * deletes a blog entry
			 * @param entry
			 * @returns {*}
			 */
			delete: function(post) {
				var deferred = $q.defer();

				Storage.delete(PACKAGE_PATH, APP_NAME, KEY_FIELDNAME, post).then(function() {
					Storage.get(PACKAGE_PATH, APP_NAME).then(function(response) {
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			},

			/**
			 * deletes all blog entries
			 * @returns {*}
			 */
			deleteAll: function() {
				var deferred = $q.defer();

				Storage.deleteAll(PACKAGE_PATH, APP_NAME).then(function() {
					Storage.get(PACKAGE_PATH, APP_NAME).then(function(response) {
						deferred.resolve(response);
					});
				});

				return deferred.promise;
			}
		};
	}]);
