'use strict';

angular.module('services.Framework')
	/**
	 * provides the ability, at module config, to determine if app is running
	 * on a device.
	 */
	.provider('EnvironmentProvider', function() {

		this._isNative = false;

		/**
		 * when created, query the user agent to determine if we're on a device
		 */
		this.$get = function() {
			this._isNative = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/) !== null;
			return this;
		};

		/**
		 * returns true if running natively, false if a webapp
		 */
		this.isNative = function() {
			return this._isNative;
		};
	});
