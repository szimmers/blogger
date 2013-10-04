'use strict';

angular.module('services.webapp')
	/**
	 * mimics the cordova FILE API for saving JSON objects. all saves are done to memory.
	 */
	.service('Storage', function ($q) {

		var _items = [];

		/**
		 * public API
		 */
		return {
			get: function(packagePath, appName) {
				var deferred = $q.defer();

				deferred.resolve(_items);

				return deferred.promise;
			},

			save: function(packagePath, appName, keyFieldName, data) {
				var deferred = $q.defer();

				_items.push(data);
				deferred.resolve(data);

				return deferred.promise;
			},

			delete: function(packagePath, appName, keyFieldName, data) {
				var deferred = $q.defer();

				var found = false;

				for (var i=0; i < _items.length; i++) {
					var item = _items[i];

					if (item === data) {
						var deletedItem = _items.splice(i, 1);

						found = true;
						deferred.resolve(deletedItem);

						break;
					}
				}

				if (found === false) {
					deferred.reject({message: 'could not find item to delete'});
				}

				return deferred.promise;
			},

			deleteAll: function(packagePath, appName) {
				var deferred = $q.defer();

				_items = [];
				deferred.resolve([]);

				return deferred.promise;
			}
		}
	});
