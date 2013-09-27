'use strict';

describe('Service: EnvironmentServiceProvider', function () {

  // load the service's module
  beforeEach(module('bloggerApp'));

  // instantiate service
  var EnvironmentServiceProvider;
  beforeEach(inject(function (_EnvironmentServiceProvider_) {
    EnvironmentServiceProvider = _EnvironmentServiceProvider_;
  }));

  it('should do something', function () {
    expect(!!EnvironmentServiceProvider).toBe(true);
  });

});
