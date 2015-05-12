/* global App */


window.App = {

	imageFunctions: {},
	zooming: false,

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

		if (! this.zooming) {

			if (keyEvent.keyCode === 49) {

				this.zooming = true;

				var actorX = Math.floor((Math.random() * App.stage.width) + 1);
				var actorY = Math.floor((Math.random() * App.stage.height) + 1);

				// zoom to the center
				App.stage.zoomToActor(actorX, actorY);

			}

		}

	},

	keyReleased: function() {

		App.stage.resetCamera();

		this.zooming = false;

	},

};


$( document ).ready(function() {

	'use strict';
	
	App.init();
	// document is ready

});