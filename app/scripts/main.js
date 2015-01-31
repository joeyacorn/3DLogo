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


	}

};


$( document ).ready(function() {

	'use strict';
	
	App.init();
	// document is ready

});