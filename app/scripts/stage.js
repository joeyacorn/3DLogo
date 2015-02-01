/* global App, THREE, requestAnimationFrame*/

'use strict';

App.stage = App.stage || {};

(function() {

	App.stage = {

		scene: null,
		camera: null,
		renderer: null,

		initWithSize: function(width, height) {

			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
			
			// create the correct renderer for our system
			if (this.webglAvailable()) {

				this.renderer = new THREE.WebGLRenderer();

			} else {

				this.renderer = new THREE.CanvasRenderer();

			}
			
			this.renderer.setSize(width, height);

			this.camera.position.x = width / 2;
			this.camera.position.y = height / 2;
			this.camera.position.z = 150;


		},

		webglAvailable: function() {

			// checks if webgl is available and returns a boolean to indicate this
			try {
				
				var canvas = document.createElement( 'canvas' );
				
				return !!( window.WebGLRenderingContext && (
					canvas.getContext( 'webgl' ) ||
					canvas.getContext( 'experimental-webgl' ) )
				);

			} catch ( e ) {

				return false;

			}

		},

		createBackgroundSprite: function() {



		},

		createActorsWithImageData: function(imageData) {

			var actorWidth = 1;
			var actorHeight = 1;

			// go through each pixel in the imageData drawing it out onto the canvas
			for(var i = 0; i < imageData.height; i++) {

				for(var j = 0; j < imageData.width; j++) {

					// work out what index we are at in the image data
					var imageDataIndex = ((i * imageData.width) + j) * 4;
					var r = imageData.data[imageDataIndex];
					var g = imageData.data[imageDataIndex + 1];
					var b = imageData.data[imageDataIndex + 2];
					//var a = imageData.data[imageDataIndex + 3];

					// create our actor sprites
					var tempSpriteMaterial = new THREE.SpriteMaterial({color: 'rgb(' + r + ',' + g + ',' + b + ')'});
					var tempSprite = new THREE.Sprite(tempSpriteMaterial);
					tempSprite.position.set(j * actorWidth, i * actorHeight, 0);
					tempSprite.scale.set(actorWidth, actorHeight, 1.0);
					this.scene.add(tempSprite);
				
				}

			}

			// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			// var cube = new THREE.Mesh( geometry, material );
			// this.scene.add( cube );
		},

		renderScene: function() {

			//requestAnimationFrame( App.stage.renderScene );
			App.stage.renderer.render( App.stage.scene, App.stage.camera );
		}

	};

})();