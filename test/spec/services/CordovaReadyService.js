'use strict';

describe('Service: CordovaReadyService', function () {

	describe('when the device is not ready', function() {
		beforeEach(module('services.Cordova'));

		var service, scope, devicereadyevent;

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			devicereadyevent = new CustomEvent(
				"deviceready", 
				{
					bubbles: true,
					cancelable: true
				}
			);

			service = $injector.get('CordovaReady');
		}));

		it('should become ready if the deviceready event fires', function () {
			service.get().then(function(response) {
				scope.data = response;
			});

			document.dispatchEvent(devicereadyevent);

			scope.$apply();

			expect(scope.data).not.toBeUndefined();
		});

		it('should indicate it is ready anytime after the deviceready event fires', function () {
			service.get();

			document.dispatchEvent(devicereadyevent);

			scope.$apply();

			service.get().then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data).not.toBeUndefined();
		});
	});

	describe('when the device will never be ready', function() {
		beforeEach(module('services.Cordova'));

		var service, scope, devicereadyevent;

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('CordovaReady');
		}));

		it('should time out and fail', inject(function ($timeout) {
			service.get().then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.rejected = response;
			});

			scope.$apply();
			$timeout.flush();

			expect(scope.data).toBeUndefined();
			expect(scope.rejected).not.toBeUndefined();
		}));

		it('should indicate it is not ready anytime after it times out', inject(function ($timeout) {
			service.get();

			scope.$apply();
			$timeout.flush();

			service.get().then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.rejected = response;
			});

			scope.$apply();

			expect(scope.data).toBeUndefined();
			expect(scope.rejected).not.toBeUndefined();
		}));
	});

});
