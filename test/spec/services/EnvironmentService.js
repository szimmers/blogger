'use strict';

describe('Service: EnvironmentService', function () {

  beforeEach(module('services.Framework'));

  var service;

  beforeEach(inject(function ($injector) {
    service = $injector.get('Environment');
  }));

  it('should do something', function () {
    expect(!!service).toBe(true);
  });

});
