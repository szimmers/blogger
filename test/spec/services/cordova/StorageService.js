'use strict';

describe('Service: StorageService (cordova)', function () {

	describe('when i need stored items', function() {
		beforeEach(module('services.CordovaAPI'));

		var service, scope, fileSystem;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var timeout;

		beforeEach(inject(function ($injector, $rootScope, $timeout) {

			resetCordovaFileTestFlags();

			scope = $rootScope.$new();

			service = $injector.get('Storage');
			timeout = $timeout;
		}));

		it('should call getDirectory', inject(function () {

			spyOn(window.fileSystem.root, 'getDirectory');

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();

			expect(window.fileSystem.root.getDirectory).toHaveBeenCalled();
		}));

		it('should call reader.readEntries', inject(function () {

			spyOn(window.reader, 'readEntries');

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();
			timeout.flush();

			expect(window.reader.readEntries).toHaveBeenCalled();
		}));

		it('should fail if i cannot get the file system', inject(function () {
			window.cordovaFileTestFlags.canGetFileSystem = false;

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.reject.message).toEqual(window.cordovaFileError.SECURITY_ERR);
		}));

		it('should fail if i cannot get the directory entry', inject(function () {
			window.cordovaFileTestFlags.canGetDirectoryEntry = false;

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NOT_FOUND_ERR);
		}));

		it('should fail if i cannot read the directory entries', inject(function () {
			window.cordovaFileTestFlags.canReadEntries = false;

			service.get(packagePath, appName).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();
			timeout.flush();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NOT_READABLE_ERR);
		}));
	});

	describe('when i save an item', function() {
		beforeEach(module('services.CordovaAPI'));

		var service, scope, fileSystem;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var keyFieldName = 'uniqueId';
		var data1 = {'uniqueId':1, message: 'i like soup.'};
		var timeout;

		beforeEach(inject(function ($injector, $rootScope, $timeout) {

			resetCordovaFileTestFlags();

			scope = $rootScope.$new();

			service = $injector.get('Storage');
			timeout = $timeout;
		}));

		it('should call writer.write', inject(function () {

			spyOn(window.fileWriter, 'write');

			service.save(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			});

			scope.$apply();
			timeout.flush();

			expect(window.fileWriter.write).toHaveBeenCalled();
		}));

		it('should fail if i cannot get the fileEntry', inject(function () {
			window.cordovaFileTestFlags.canGetFile = false;

			service.save(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NOT_FOUND_ERR);
		}));

		it('should fail if i cannot create the file writer', inject(function () {
			window.cordovaFileTestFlags.canCreateWriter = false;

			service.save(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();
			timeout.flush();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NO_MODIFICATION_ALLOWED_ERR);
		}));

	});

	describe('when i delete an item', function() {
		beforeEach(module('services.CordovaAPI'));

		var service, scope, fileSystem;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var keyFieldName = 'uniqueId';
		var data1 = {'uniqueId':1, message: 'i like soup.'};
		var timeout;

		beforeEach(inject(function ($injector, $rootScope, $timeout) {

			resetCordovaFileTestFlags();

			scope = $rootScope.$new();

			service = $injector.get('Storage');
			timeout = $timeout;
		}));

		// the file api mock provides an entry to remove, even if it doesn't
		// really exist. so we expect to get to the point where we can 'remove' it.
		it('should call fileEntry.remove', inject(function () {

			spyOn(window.fileEntry, 'remove');

			service.delete(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			});

			scope.$apply();
			timeout.flush();

			expect(window.fileEntry.remove).toHaveBeenCalled();
		}));

		it('should fail if i cannot get the fileEntry', inject(function () {
			window.cordovaFileTestFlags.canGetFile = false;

			service.delete(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NOT_FOUND_ERR);
		}));

		it('should fail if i cannot delete the file', inject(function () {
			window.cordovaFileTestFlags.canRemoveFile = false;

			service.delete(packagePath, appName, keyFieldName, data1).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();
			timeout.flush();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NO_MODIFICATION_ALLOWED_ERR);
		}));

	});

	describe('when i delete all items', function() {
		beforeEach(module('services.CordovaAPI'));

		var service, scope, fileSystem;
		var packagePath = 'com.foo';
		var appName = 'Bar';
		var timeout;

		beforeEach(inject(function ($injector, $rootScope, $timeout) {

			resetCordovaFileTestFlags();

			scope = $rootScope.$new();

			service = $injector.get('Storage');
			timeout = $timeout;
		}));

		// the reader mock provided by the directory entry mock provides a entries to remove,
		// even if they don't really exist. so we expect to get to the point where we can 'remove' one.
		it('should call fileEntry.remove', inject(function () {

			spyOn(window.fileEntry, 'remove');

			service.deleteAll(packagePath, appName).then(function(response) {
				scope.data = response;
			});

			scope.$apply();
			timeout.flush();

			expect(window.fileEntry.remove).toHaveBeenCalled();
		}));

		it('should fail if i cannot get the directory entry', inject(function () {
			window.cordovaFileTestFlags.canGetDirectoryEntry = false;

			service.deleteAll(packagePath, appName).then(function(response) {
				scope.data = response;
			}, function(response) {
				scope.reject = response;
			});

			scope.$apply();

			expect(scope.reject.message).toEqual(window.cordovaFileError.NOT_FOUND_ERR);
		}));

	});

});
