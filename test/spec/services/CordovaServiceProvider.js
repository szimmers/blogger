'use strict';

describe('Service: CordovaServiceProvider', function () {

  // load the service's module
  beforeEach(module('bloggerApp'));

  // instantiate service
  var CordovaServiceProvider;
  beforeEach(inject(function (_CordovaServiceProvider_) {
    CordovaServiceProvider = _CordovaServiceProvider_;
  }));

  it('should do something', function () {
    expect(!!CordovaServiceProvider).toBe(true);
  });

});
