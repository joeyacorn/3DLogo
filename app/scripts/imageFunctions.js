/* global App*/

'use strict';

App.imageFunctions = App.imageFunctions || {};

(function() {

	App.imageFunctions = {

		getOffscreenContext: function(width, height) {

			// return an offscreen canvas context for the given width and height

			// create an offscreen canvas element
			var offscreenCanvas = document.createElement('canvas');

			// set the width and height to that of the image
			offscreenCanvas.width = width;
			offscreenCanvas.height = height;

			// get the 2d context
			return offscreenCanvas.getContext('2d');

		},

		getPixelsFromImage: function(imageSrc, callback) {

			// load in the passed image
			var tempImage = new Image();

			tempImage.onload = function() {

				// get loaded image
				var loadedImage = this;

				var offscreenCanvasContext = App.Functions.getOffscreenContext(loadedImage.width, loadedImage.height);

				// draw the image into the canvas element
				offscreenCanvasContext.drawImage(loadedImage, 0, 0);

				// get the iamge data from the image
				var imageData = offscreenCanvasContext.getImageData(0, 0, loadedImage.width, loadedImage.height);

				// return the image data
				callback(imageData);

			};

			tempImage.onerror = function(event) {

				console.log(event);

			};

			tempImage.src = imageSrc;

		}

	};

})();