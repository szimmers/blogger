'use strict';

describe('Service: CordovaReadyService', function () {

  beforeEach(module('services.Cordova'));

  var service;

  beforeEach(inject(function ($injector) {
    service = $injector.get('CordovaReady');
  }));

  it('should do something', function () {
    expect(!!service).toBe(true);
  });

});
