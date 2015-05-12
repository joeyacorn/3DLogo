/* global App, THREE, requestAnimationFrame, TWEEN*/

'use strict';

App.stage = App.stage || {};

(function() {

	App.stage = {

		scene: null,
		camera: null,
		renderer: null,
		cameraUpdateVelocity: 3.0,
		width: 0,
		height: 0,
		actors: null,

		initWithSize: function(width, height) {

			this.width = width;
			this.height = height;
			this.scene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000 );
			
			// create the correct renderer for our system
			if (this.webglAvailable()) {

				this.renderer = new THREE.WebGLRenderer();

			} else {

				this.renderer = new THREE.CanvasRenderer();

			}
			
			this.renderer.setSize(width, height);

			this.resetCamera();

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

			var geometry = new THREE.Geometry();

			this.actors = [];

			// go through each pixel in the imageData drawing it out onto the canvas
			for(var i = imageData.height; i > 0; i--) {

				var rowArray = [];

				for(var j = 0; j < imageData.width; j++) {

					// work out what index we are at in the image data
					var imageDataIndex = (((imageData.height - i) * imageData.width) + j) * 4;
					var r = imageData.data[imageDataIndex];
					var g = imageData.data[imageDataIndex + 1];
					var b = imageData.data[imageDataIndex + 2];
					// var a = imageData.data[imageDataIndex + 3];

					// create our actors
					this.createGeometryForQuad(geometry, j * actorWidth, i * actorHeight, actorWidth, actorHeight, (i * imageData.width) + j, 'rgb(' + r + ',' + g + ',' + b + ')');

					// save reference to actor
					rowArray.push({r: r, g: g, b: b, x: j * actorWidth, y: i * actorHeight});
				
				}

				// save reference to row of actors
				this.actors.push(rowArray);

			}

			var material = new THREE.MeshBasicMaterial({ vertexColors:THREE.VertexColors});
			var mesh = new THREE.Mesh( geometry, material);
			this.scene.add(mesh);

		},

		createGeometryForQuad: function(geometry, x, y, width, height, quadIndex, color) {

			var vertexIndex = geometry.vertices.length;

			geometry.vertices.push( new THREE.Vector3( x, y, 0 ) );
			geometry.vertices.push( new THREE.Vector3( x + width, y, 0 ) );
			geometry.vertices.push( new THREE.Vector3( x + width, y + height, 0 ) );
			geometry.vertices.push( new THREE.Vector3( x, y + height, 0 ) );
 
			var tempFace1 = new THREE.Face3( vertexIndex, vertexIndex + 1, vertexIndex + 2 ); // counter-clockwise winding order

			// set the correct colours
			tempFace1.vertexColors[0] = new THREE.Color(color);
			tempFace1.vertexColors[1] = new THREE.Color(color);
			tempFace1.vertexColors[2] = new THREE.Color(color);

			var tempFace2 = new THREE.Face3( vertexIndex, vertexIndex + 2, vertexIndex + 3 );

			// set the correct colours
			tempFace2.vertexColors[0] = new THREE.Color(color);
			tempFace2.vertexColors[1] = new THREE.Color(color);
			tempFace2.vertexColors[2] = new THREE.Color(color);

			geometry.faces.push( tempFace1 );
			geometry.faces.push( tempFace2 );


		},

		renderScene: function() {

			requestAnimationFrame( App.stage.renderScene );
			App.stage.update();
			App.stage.renderer.render( App.stage.scene, App.stage.camera );
		},

		update: function() {

			TWEEN.update();

		},

		zoomToActor: function(x, y) {

			// for the given image coordinates, 
			// zoom the camera in 
			// look at the coords as a center point
			// keep the camera looking down the z axis

			// zoom to the defined actors position
			var tempActor = this.actors[y][x];

			// tween to the new position
			var tween = new TWEEN.Tween(App.stage.camera.position)
				.to({x: tempActor.x, y: tempActor.y, z: 10}, 500).easing(TWEEN.Easing.Quartic.Out);
			tween.start();

		},

		resetCamera: function() {

			// tween to the new position
			var tween = new TWEEN.Tween(App.stage.camera.position)
				.to({x: this.width / 2, y: this.height / 2, z: 150}, 500).easing(TWEEN.Easing.Quartic.Out);
			tween.start();

		},

		addHTMLElementToActor: function(x, y) {



		}

	};

})();