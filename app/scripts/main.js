$( document ).ready(function() {

	'use strict';
    
	// document is ready

	var getImagePixels = function(imageSrc, callback) {

		// load in the passed image
		var tempImage = new Image();

		tempImage.onload = function() {

			// get loaded image
			var loadedImage = this;

			// create an offscreen canvas element
			var offscreenCanvas = document.createElement('canvas');

			// set the width and height to that of the image
			offscreenCanvas.width = loadedImage.width;
			offscreenCanvas.height = loadedImage.height;

			// get the 2d context
			var offscreenCanvasContext = offscreenCanvas.getContext('2d');

			// draw the image into the canvas element
			offscreenCanvasContext.drawImage(loadedImage, 0, 0);

			// get the iamge data from the image
			var imageData = offscreenCanvasContext.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);

			// return the image data
			callback(imageData);

		};

		tempImage.onerror = function(event) {

			console.log(event);

		};

		tempImage.src = imageSrc;

	};

	// load in a sample image
	getImagePixels('../images/nyan.png', function(imageData) {

		// create an offscreen canvas
		var offscreenCanvas = document.createElement('canvas');

		// get the 2d context
		var offscreenCanvasContext = offscreenCanvas.getContext('2d');

		// set the width and height to that of the image
		offscreenCanvas.width = imageData.width;
		offscreenCanvas.height = imageData.height;

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
		var finalCanvas = $(offscreenCanvas);
		$('div.generated').append(finalCanvas);

	});


});