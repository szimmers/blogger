'use strict';

angular.module('services.CordovaProvider', [])
	/**
	 * provides the ability, at module config, to determine if app is running
	 * on a device.
	 */
	.provider('CordovaProvider', function() {

		this.$get = function() {
			return this;
		};

		this.isNative = function() {
			return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) !== null;
		};
	})

