/* global App */


window.App = {

	imageFunctions: {},
	zooming: false,
	image: null,

	init: function() {

		'use strict';

		// set the reference image
		this.image = '../images/porsche.png';
		$('div.source').css('background-image', 'url(' + this.image + ')');
		$('div.coverImage').css('background-image', 'url(' + this.image + ')');

		// load in a sample image
		App.imageFunctions.getPixelsFromImage(this.image, function(imageData) {

			// we have an image size and we have a window size, 
			// so calculate the dimensions we would like our output canvas to be
			// so we can create the cavas to this size instead of expanding it with css
			var outputCanvasStyle = App.getPeferredCanvasStyle(imageData.width, imageData.height);

			// initiliase our stage
			App.stage.initWithSize(outputCanvasStyle.width, outputCanvasStyle.height);

			// add our actors
			App.stage.createActorsWithImageData(imageData);

			var canvasContainer = $('div.canvasContainer');

			// get both the webGL renderer and the css renderer onto the screen
			var canvas = $(App.stage.renderer.domElement);
			canvasContainer.append(canvas);
			canvas.addClass('webglCanvas');

			var cssCanvas = $(App.stage.cssRenderer.domElement);
			canvasContainer.append(cssCanvas);
			cssCanvas.addClass('cssCanvas');

			// and kick off our rendering
			App.stage.renderScene();

		});

		// listen for keypresses
		window.addEventListener('keydown', App.keyPressed, false);
		window.addEventListener('keyup', App.keyReleased, false);

	},

	getPeferredCanvasStyle: function(imageWidth, imageHeight) {

		// compare the image width and height against the window width and height
		// and work out the preferred size of the canvas


		var newImageWidth;
		var newImageHeight;
		var newLeft;
		var newTop;
		var widthRatio = imageWidth / window.innerWidth;
		var heightRatio = imageHeight / window.innerHeight;
		var tempRatio;

		if (heightRatio > widthRatio) {

			// we want to fill the height of the window
			// which will determine the width of the canvas
			newImageHeight = window.innerHeight;
			tempRatio = newImageHeight / imageHeight;
			newImageWidth = imageWidth * tempRatio;
			newLeft = (window.innerWidth - newImageWidth) / 2;
			newTop = 0;

		} else {

			// we want to fill the width of the window
			// which will determine the height of the canvas
			newImageWidth = window.innerWidth;
			tempRatio = newImageWidth / imageWidth;
			newImageHeight = imageHeight * tempRatio;
			newLeft = 0;
			newTop = (window.innerHeight - newImageHeight) / 2;

		}

		var objReturn = {};
		objReturn.width = newImageWidth;
		objReturn.height = newImageHeight;

		return objReturn;

	},

	keyPressed: function(keyEvent) {

		if (! this.zooming) {

			if (keyEvent.keyCode === 49) {

				this.zooming = true;

				var actorX = Math.floor((Math.random() * App.stage.imageWidth) + 1);
				var actorY = Math.floor((Math.random() * App.stage.imageHeight) + 1);

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