/* global App, THREE, requestAnimationFrame, TWEEN*/

'use strict';

App.stage = App.stage || {};

(function() {

	App.stage = {

		scene: null,
		cssScene: null,
		camera: null,
		renderer: null,
		cssRenderer: null,
		cameraUpdateVelocity: 3.0,
		sceneWidth: 0,
		sceneHeight: 0,
		imageWidth: 0,
		imageHeight: 0,
		actors: null,

		initWithSize: function(width, height) {

			this.sceneWidth = width;
			this.sceneHeight = height;
			this.scene = new THREE.Scene();
			this.cssScene = new THREE.Scene();
			this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			
			// create the correct renderer for our system
			if (this.webglAvailable()) {

				this.renderer = new THREE.WebGLRenderer();

			} else {

				this.renderer = new THREE.CanvasRenderer();

			}

			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.setClearColor(0xffffff);

			// and set up our css renderer
			this.cssRenderer = new THREE.CSS3DRenderer();
			this.cssRenderer.setSize(window.innerWidth, window.innerHeight);

			// reset the camera
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

			this.imageWidth = imageData.width;
			this.imageHeight = imageData.height;

			// calculate the width and height each pixel will need to be 
			// in the final output, compared to the input image
			var widthRatio = this.sceneWidth / imageData.width;
			var heightRatio = this.sceneHeight / imageData.height;
			this.actorWidth = 1 * widthRatio;
			this.actorHeight = 1 * heightRatio;

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
					this.createGeometryForQuad(geometry, j * this.actorWidth, i * this.actorHeight, this.actorWidth, this.actorHeight, (i * imageData.width) + j, 'rgb(' + r + ',' + g + ',' + b + ')');

					// save reference to actor
					rowArray.push({r: r, g: g, b: b, x: j * this.actorWidth, y: i * this.actorHeight});
				
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

			var zRange = 3.0;
			var zDepth = this.getRandomArbitrary(0 - zRange, 0 + zRange);
			var actorDepth = 1.0;

			// ------- front face

			geometry.vertices.push( new THREE.Vector3( x, y, zDepth ) );					// index 0
			geometry.vertices.push( new THREE.Vector3( x + width, y, zDepth ) );			// index 1
			geometry.vertices.push( new THREE.Vector3( x + width, y + height, zDepth ) );	// index 2
			geometry.vertices.push( new THREE.Vector3( x, y + height, zDepth ) );			// index 3

			var frontFace1 = new THREE.Face3( vertexIndex, vertexIndex + 1, vertexIndex + 2 ); // counter-clockwise winding order

			// set the correct colours
			frontFace1.vertexColors[0] = new THREE.Color(color);
			frontFace1.vertexColors[1] = new THREE.Color(color);
			frontFace1.vertexColors[2] = new THREE.Color(color);

			var frontFace2 = new THREE.Face3( vertexIndex, vertexIndex + 2, vertexIndex + 3 );

			// set the correct colours
			frontFace2.vertexColors[0] = new THREE.Color(color);
			frontFace2.vertexColors[1] = new THREE.Color(color);
			frontFace2.vertexColors[2] = new THREE.Color(color);

			// ------- left face

			geometry.vertices.push( new THREE.Vector3( x, y, zDepth - actorDepth ) );			// index 4
			geometry.vertices.push( new THREE.Vector3( x, y + height, zDepth - actorDepth ) );	// index 5

			var leftFace1 = new THREE.Face3( vertexIndex, vertexIndex + 3, vertexIndex + 5 );
			leftFace1.vertexColors[0] = new THREE.Color(color);
			leftFace1.vertexColors[1] = new THREE.Color(color);
			leftFace1.vertexColors[2] = new THREE.Color(color);

			var leftFace2 = new THREE.Face3( vertexIndex, vertexIndex + 5, vertexIndex + 4 );
			leftFace2.vertexColors[0] = new THREE.Color(color);
			leftFace2.vertexColors[1] = new THREE.Color(color);
			leftFace2.vertexColors[2] = new THREE.Color(color);

			// ------- bottom face

			geometry.vertices.push( new THREE.Vector3( x + width, y, zDepth - actorDepth ) );	// index 6

			var bottomFace1 = new THREE.Face3( vertexIndex, vertexIndex + 4, vertexIndex + 1 );
			bottomFace1.vertexColors[0] = new THREE.Color(color);
			bottomFace1.vertexColors[1] = new THREE.Color(color);
			bottomFace1.vertexColors[2] = new THREE.Color(color);

			var bottomFace2 = new THREE.Face3( vertexIndex + 1, vertexIndex + 4, vertexIndex + 6 );
			bottomFace2.vertexColors[0] = new THREE.Color(color);
			bottomFace2.vertexColors[1] = new THREE.Color(color);
			bottomFace2.vertexColors[2] = new THREE.Color(color);

			// ------- top face

			geometry.vertices.push( new THREE.Vector3( x + width, y + height, zDepth - actorDepth ) );	// index 7

			var topFace1 = new THREE.Face3( vertexIndex + 3, vertexIndex + 7, vertexIndex + 5 );
			topFace1.vertexColors[0] = new THREE.Color(color);
			topFace1.vertexColors[1] = new THREE.Color(color);
			topFace1.vertexColors[2] = new THREE.Color(color);

			var topFace2 = new THREE.Face3( vertexIndex + 3, vertexIndex + 2, vertexIndex + 7 );
			topFace2.vertexColors[0] = new THREE.Color(color);
			topFace2.vertexColors[1] = new THREE.Color(color);
			topFace2.vertexColors[2] = new THREE.Color(color);

			// ------- right face

			var rightFace1 = new THREE.Face3( vertexIndex + 2, vertexIndex + 1, vertexIndex + 7 );
			rightFace1.vertexColors[0] = new THREE.Color(color);
			rightFace1.vertexColors[1] = new THREE.Color(color);
			rightFace1.vertexColors[2] = new THREE.Color(color);

			var rightFace2 = new THREE.Face3( vertexIndex + 1, vertexIndex + 6, vertexIndex + 7 );
			rightFace2.vertexColors[0] = new THREE.Color(color);
			rightFace2.vertexColors[1] = new THREE.Color(color);
			rightFace2.vertexColors[2] = new THREE.Color(color);


			// add all faces to geometry

			geometry.faces.push( frontFace1 );
			geometry.faces.push( frontFace2 );
			geometry.faces.push( leftFace1 );
			geometry.faces.push( leftFace2 );
			geometry.faces.push( bottomFace1 );
			geometry.faces.push( bottomFace2 );
			geometry.faces.push( topFace1 );
			geometry.faces.push( topFace2 );
			geometry.faces.push( rightFace1 );
			geometry.faces.push( rightFace2 );

		},

		getRandomArbitrary: function(min, max) {

			return Math.random() * (max - min) + min;

		},

		renderScene: function() {

			// make sure we fire this function again
			requestAnimationFrame( App.stage.renderScene );

			// ask the stage to update it's scenes
			App.stage.update();
			
			// and render our scenes
			App.stage.renderer.render( App.stage.scene, App.stage.camera );
			App.stage.cssRenderer.render( App.stage.cssScene, App.stage.camera );
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
			var animationSpeed = 2000;

			// tween to the new position
			var positionTween = new TWEEN.Tween(App.stage.camera.position)
				.to({x: tempActor.x - (App.stage.imageWidth / 10), y: tempActor.y, z: 5}, animationSpeed).easing(TWEEN.Easing.Quartic.Out)
				.onComplete(function() {

					App.stage.addHTMLElementToActor(x, y);

					var panTween = new TWEEN.Tween(App.stage.camera.position)
						.to({x: App.stage.camera.position.x + 50.0}, 10000);
					panTween.start();

				});
			positionTween.start();
			var rotationTween = new TWEEN.Tween(App.stage.camera.rotation)
				.to({x: 0, y: -0.174, z: 0}, animationSpeed).easing(TWEEN.Easing.Quartic.Out);
			rotationTween.start();

		},

		resetCamera: function() {

			var preferredDistanceFromActors = 150;

			// we need to calculate the field fo view based on the size of the scene
			var fieldOfView = 2 * Math.atan( ( window.innerWidth / (window.innerWidth / window.innerHeight) ) / ( 2 * preferredDistanceFromActors ) ) * ( 180 / Math.PI );

			App.stage.camera.fov = fieldOfView;
			App.stage.camera.updateProjectionMatrix();

			var animationSpeed = 500;

			// tween to the new position
			var postionTween = new TWEEN.Tween(App.stage.camera.position)
				.to({x: App.stage.sceneWidth / 2, y: App.stage.sceneHeight / 2, z: preferredDistanceFromActors}, animationSpeed).easing(TWEEN.Easing.Quartic.Out);
				
			postionTween.start();
			var rotationTween = new TWEEN.Tween(App.stage.camera.rotation)
				.to({x: 0, y: 0, z: 0}, animationSpeed).easing(TWEEN.Easing.Quartic.Out)
				.onComplete(function() {

					TWEEN.removeAll();

				});
			rotationTween.start();
				

		},

		addHTMLElementToActor: function(x, y) {

			var tempActor = App.stage.actors[y][x];

			// using this x and y position, create an html element
			var element = document.createElement( 'div' );
			element.className = 'cssObjects';
			element.style.width = App.stage.actorWidth + 'px';
			element.style.height = App.stage.actorHeight + 'px';
			element.style.backgroundColor = 'rgb(' + tempActor.r + ',' + tempActor.g + ',' + tempActor.b + ')';
			
			// create the object3d for this element
			var cssObject = new THREE.CSS3DObject( element );
			// we reference the same position and rotation 
			cssObject.position.x = tempActor.x + (App.stage.actorWidth / 2);
			cssObject.position.y = tempActor.y + (App.stage.actorHeight / 2);
			cssObject.position.z = 0;

			// add it to the css scene
			App.stage.cssScene.add(cssObject);

		}

	};

})();