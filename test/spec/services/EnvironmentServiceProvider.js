'use strict';

describe('Service: EnvironmentServiceProvider', function () {

  beforeEach(module('services.Framework'));

  var service;

  beforeEach(inject(function ($injector) {
    service = $injector.get('EnvironmentProvider');
  }));

  it('should do something', function () {
    expect(!!service).toBe(true);
  });

});
