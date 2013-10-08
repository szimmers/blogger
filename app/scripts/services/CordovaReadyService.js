'use strict';

angular.module('services.Cordova')
	/**
	 * in ms, timeout value for the service
	 */
	.constant('TIMEOUT_MS', 2500)
	/**
	 * service that handles cordova readiness. it is responsible for setting the listener
	 * for deviceready. it is also responsible for knowing if the device is ready. if the
	 * device is ready, it will resolve its promise immediately.
	 *
	 * if the deviceready listener times out, it will reject its promise.
	 *
	 * this service needs to be invoked near app start, in order for the deviceready event
	 * to be caught.
	 *
	 * all promises are resolved with a 'message' property; when rejected, that property
	 * will contain the reason string.
	 */
	.service('CordovaReady', ['$q', '$timeout', 'TIMEOUT_MS', function($q, $timeout, TIMEOUT_MS) {
		var _ready = false;
		var _listenerAdded = false;
		var _timedOut = false;

		return {
			get: function() {
				var deferred = $q.defer();

				// reject the promise if we time out
				var handleServiceTimeout = function() {
					_timedOut = true;
					var error = { 'message': 'Connection to device timed out' };
					deferred.reject(error);
				};

				// fulfill the promise immediately if already ready
				if (_ready === true) {
					var ready = {'message': 'device was already ready'};
					deferred.resolve(ready);
				}
				// reject the promise immediately if already timed out. we won't get the event again,
				// so don't even try.
				else if (_timedOut === true) {
					var error = { 'message': 'Connection to device had already timed out' };
					deferred.reject(error);
				}
				else {
					// startup logic -- add listener for device ready
					if (_listenerAdded === false) {
						$timeout(handleServiceTimeout, TIMEOUT_MS);

						_listenerAdded = true;

						document.addEventListener('deviceready', function() {
							$timeout.cancel(handleServiceTimeout);
							_ready = true;
							var ready = {'message': 'device is now ready'};
							deferred.resolve(ready);
						}, false);
					}
				}

				return deferred.promise;
			}
		};
	}]);

