'use strict';

describe('Service: CordovaReadyService', function () {

  // load the service's module
  beforeEach(module('bloggerApp'));

  // instantiate service
  var CordovaReadyService;
  beforeEach(inject(function (_CordovaReadyService_) {
    CordovaReadyService = _CordovaReadyService_;
  }));

  it('should do something', function () {
    expect(!!CordovaReadyService).toBe(true);
  });

});
