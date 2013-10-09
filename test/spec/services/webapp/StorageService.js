'use strict';

describe('Service: StorageService (webapp)', function () {

	describe('when i need stored items', function() {
		beforeEach(module('services.webapp'));

		var service, scope;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var keyFieldName = 'uniqueId';
		var data1 = {'uniqueId':1, message: 'i like soup.'};
		var data2 = {'uniqueId':2, message: 'soup is good food.'};

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('Storage');

			service.save(packagePath, appName, keyFieldName, data1);
			service.save(packagePath, appName, keyFieldName, data2);
		}));

		it('should return them', inject(function () {

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(2);
		}));

	});

	describe('when i delete a stored item', function() {
		beforeEach(module('services.webapp'));

		var service, scope;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var keyFieldName = 'uniqueId';
		var data1 = {'uniqueId':1, message: 'i like soup.'};
		var data2 = {'uniqueId':2, message: 'soup is good food.'};
		var data3 = {'uniqueId':3, message: 'i was never added.'};

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('Storage');

			service.save(packagePath, appName, keyFieldName, data1);
			service.save(packagePath, appName, keyFieldName, data2);
		}));

		it('should return the deleted item', inject(function () {

			service.delete(packagePath, appName, keyFieldName, data2).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data).toEqual(data2);
		}));

		it('should return the remainder from the get', inject(function () {

			service.delete(packagePath, appName, keyFieldName, data1);

			scope.$apply();

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data[0]).toEqual(data2);
		}));

		it('should fail if the item cannot be found', inject(function () {

			service.delete(packagePath, appName, keyFieldName, data3).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.data).toBeUndefined();
			expect(scope.reject).not.toBeUndefined();
		}));

	});

	describe('when i delete all the stored items', function() {
		beforeEach(module('services.webapp'));

		var service, scope;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var keyFieldName = 'uniqueId';
		var data1 = {'uniqueId':1, message: 'i like soup.'};
		var data2 = {'uniqueId':2, message: 'soup is good food.'};

		beforeEach(inject(function ($injector, $rootScope) {

			scope = $rootScope.$new();

			service = $injector.get('Storage');

			service.save(packagePath, appName, keyFieldName, data1);
			service.save(packagePath, appName, keyFieldName, data2);
		}));

		it('should return an empty array', inject(function () {

			service.deleteAll(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(0);
		}));

		it('should return an empty array from the get', inject(function () {

			service.deleteAll(packagePath, appName);

			scope.$apply();

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(scope.data.length).toEqual(0);
		}));

	});

});
