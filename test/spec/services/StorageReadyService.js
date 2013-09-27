'use strict';

describe('Service: StorageReadyService', function () {

  // load the service's module
  beforeEach(module('bloggerApp'));

  // instantiate service
  var StorageReadyService;
  beforeEach(inject(function (_StorageReadyService_) {
    StorageReadyService = _StorageReadyService_;
  }));

  it('should do something', function () {
    expect(!!StorageReadyService).toBe(true);
  });

});
