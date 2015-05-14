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

			var canvasContainer = $('div.canvasContainer');

			// get both the webGL renderer and the css renderer onto the screen
			var canvas = $(App.stage.renderer.domElement);
			canvasContainer.append(canvas);
			canvas.addClass('webglCanvas');

			var cssCanvas = $(App.stage.cssRenderer.domElement);
			canvasContainer.append(cssCanvas);
			cssCanvas.addClass('cssCanvas');

			// resize our canvas container to maximise the use of space in the window
			var newStyle = App.getPeferredCanvasStyle(imageData.width, imageData.height);

			canvasContainer.css(newStyle);

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

		// work out the orientation of the image
		var landscapeImage = true;
		if (imageHeight > imageWidth) {

			landscapeImage = false;

		}

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

		return {width: newImageWidth + 'px', height: newImageHeight + 'px', left: newLeft + 'px', top: newTop + 'px', position: 'absolute'};

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