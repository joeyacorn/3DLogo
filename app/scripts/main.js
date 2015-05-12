/* global App */


window.App = {

	imageFunctions: {},

	init: function() {

		'use strict';

		// load in a sample image
		App.imageFunctions.getPixelsFromImage('../images/nyan.png', function(imageData) {

			// initiliase our stage
			App.stage.initWithSize(imageData.width, imageData.height);

			// add our actors
			App.stage.createActorsWithImageData(imageData);

			// get the renderer onto the screen
			var canvas = $(App.stage.renderer.domElement);
			$('div.generated').append(canvas);

			// and kick off our rendering
			App.stage.renderScene();

		});

		// listen for keypresses
		window.addEventListener('keydown', App.keyPressed, false);
		window.addEventListener('keyup', App.keyReleased, false);

	},

	keyPressed: function(keyEvent) {

		if (keyEvent.keyCode === 49) {

			// zoom to the center
			App.stage.zoomToImageCoords(App.stage.width / 2, App.stage.height / 2);

		}

	},

	keyReleased: function() {

		App.stage.resetCamera();

	},

};


$( document ).ready(function() {

	'use strict';
	
	App.init();
	// document is ready

});