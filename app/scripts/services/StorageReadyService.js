'use strict';

angular.module('services.StorageReadyService', ['services.Environment'])
	.service('StorageReady', function ($q, Environment) {
		return {
			get: function() {
				var deferred = $q.defer();

				if (Environment.isNative() == false) {
					var ready = {'ready':true};
					deferred.resolve(ready);
				}
				else {
					CordovaReady.get().then(function(response) {
						deferred.resolve(response);
					});
				}

				return deferred.promise;
			}
		};
	});

	/*
angular.module('services.StorageReadyService', ['services.CordovaReadyService'])
	.service('StorageReady', function ($q, DEPLOY_TYPE, CordovaReady) {
		return {
			get: function() {
				var deferred = $q.defer();

				if (DEPLOY_TYPE === 'webapp') {
					var ready = {'ready':true};
					deferred.resolve(ready);
				}
				else {
					CordovaReady.get().then(function(response) {
						deferred.resolve(response);
					});
				}

				return deferred.promise;
			}
		};
	});
	*/
