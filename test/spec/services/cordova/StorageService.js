'use strict';

describe('Service: StorageService', function () {

  beforeEach(module('services.CordovaAPI'));

  var service;
  
  beforeEach(inject(function ($injector) {
    service = $injector.get('Storage');
  }));

  it('should do something', function () {
    expect(!!service).toBe(true);
  });

});
