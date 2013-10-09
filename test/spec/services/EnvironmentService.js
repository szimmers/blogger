'use strict';

describe('Service: EnvironmentService', function () {

	describe('when the environment is native', function() {

		beforeEach(module('services.Framework'));

		var service, scope;

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();
			$rootScope.isNative = true;

			service = $injector.get('Environment');
		}));

		it('should indicate such when asked', function () {
			expect(service.isNative()).toBeTruthy();
		});
	});

	describe('when the environment is not native', function() {

		beforeEach(module('services.Framework'));

		var service, scope;

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();
			$rootScope.isNative = false;

			service = $injector.get('Environment');
		}));

		it('should indicate such when asked', function () {
			expect(service.isNative()).toBeFalsy();
		});

		it('should give me a message when i wait for the device to be ready', function () {
			service.waitForDeviceReady().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.message).toBe('ready immediately');
		});
	});

	describe('when the device is not ready', function() {

		beforeEach(module('services.Framework'));

		var service, scope;

		// mock for CordovaReady service
		beforeEach(function () {

			var getDeferred;

			var mockReadyService = {
				get: function() {
					getDeferred.resolve({});
					return getDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('CordovaReady', mockReadyService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();
			$rootScope.isNative = true;

			service = $injector.get('Environment');
		}));

		it('should return false when asked', function () {
			expect(service.isReady()).toBeFalsy();
		});

		it('should become ready when we wait', function () {
			service.waitForDeviceReady().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(service.isReady()).toBeTruthy();
		});
	});

	describe('when the device will never be ready', function() {

		beforeEach(module('services.Framework'));

		var service, scope;

		// mock for CordovaReady service
		beforeEach(function () {

			var getDeferred;

			var mockReadyService = {
				get: function() {
					getDeferred.reject('timed out');
					return getDeferred.promise;
				}
			};

			module(function ($provide) {
				$provide.value('CordovaReady', mockReadyService);
			});

			inject(function($q) {
				getDeferred = $q.defer();
			})
		});

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();
			$rootScope.isNative = true;

			service = $injector.get('Environment');
		}));

		it('should remain unready if the ready service fails', function () {
			service.waitForDeviceReady().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(service.isReady()).toBeFalsy();
		});
	});

});
