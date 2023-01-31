/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"demo/pocui5classicrest/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
