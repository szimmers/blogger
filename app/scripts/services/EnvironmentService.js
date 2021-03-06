'use strict';

angular.module('services.Framework')
	/**
	 * provides to services the ability to determine if app is running
	 * on a device.
	 */
	.service('Environment', ['$rootScope', '$q', 'CordovaReady', function ($rootScope, $q, CordovaReady) {

		var _deviceReady = false;

		return {
			/**
			 * returns true if running natively, false if a webapp
			 */
			isNative: function() {
				return $rootScope.isNative;
			},

			/**
			 * returns true if native device is ready
			 */
			isReady: function() {
				return _deviceReady;
			},

			/**
			 * waits for the device to ready itself, then resolves its promise. promise is resolved
			 * immediately if device is ready. promise is rejected if device times out.
			 */
			waitForDeviceReady: function() {
				var deferred = $q.defer();

				if (this.isNative() === false) {
					var ready = {'message': 'ready immediately'};
					deferred.resolve(ready);
				}
				else {
					// this service resolves immediately if ready
					CordovaReady.get().then(function(response) {
						_deviceReady = true;
						deferred.resolve(response);
					}, function(response) {
						deferred.reject(response.message);
					});
				}

				return deferred.promise;
			}
		};
	}]);
