'use strict';

describe('Service: EnvironmentServiceProvider', function () {

	describe('when the environment is not native', function() {

		beforeEach(module('services.Framework'));

		var service, scope;

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('EnvironmentProvider');
		}));

		it('should indicate such when asked', function () {
			expect(service.isNative()).toBeFalsy();
		});
	});

});
