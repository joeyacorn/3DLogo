/* global App */


window.App = {

	Functions: {},

	init: function() {

		'use strict';

		// load in a sample image
		App.Functions.getPixelsFromImage('../images/nyan.png', function(imageData) {

			var offscreenCanvasContext = App.Functions.getOffscreenContext(imageData.width, imageData.height);

			// go through each pixel drawing it out onto the canvas
			for(var i = 0; i < imageData.height; i++) {

				for(var j = 0; j < imageData.width; j++) {

					// work out what index we are at in the image data
					var imageDataIndex = ((i * imageData.width) + j) * 4;
					var r = imageData.data[imageDataIndex];
					var g = imageData.data[imageDataIndex + 1];
					var b = imageData.data[imageDataIndex + 2];
					var a = imageData.data[imageDataIndex + 3];

					// set the correct colour value
					offscreenCanvasContext.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
					offscreenCanvasContext.fillRect(j, i, 1, 1);
				
				}

			}

			// put the canvas on the screen
			var finalCanvas = $(offscreenCanvasContext.canvas);
			$('div.generated').append(finalCanvas);

		});


	}

};


$( document ).ready(function() {

	'use strict';
	
	App.init();
	// document is ready

});