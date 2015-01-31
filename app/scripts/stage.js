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
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize(width, height);

			this.camera.position.x = width / 2;
			this.camera.position.y = height / 2;
			this.camera.position.z = 1000;


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

					// create our actors
					var geometry = this.createGeometryForQuad(actorWidth, actorHeight);
					var material = new THREE.MeshBasicMaterial({ color: 'rgb(' + r + ', ' + g + ', ' + b + ')'});
					material.side = THREE.DoubleSide;
					var mesh = new THREE.Mesh( geometry, material );
					this.scene.add(mesh);

					// move the mesh to the correct position
					mesh.translateX(j);
					mesh.translateY(i);
				
				}

			}

			// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
			// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
			// var cube = new THREE.Mesh( geometry, material );
			// this.scene.add( cube );
		},

		createGeometryForQuad: function(width, height) {

			var geometry = new THREE.Geometry();

			geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( width, 0, 0 ) );
			geometry.vertices.push( new THREE.Vector3( width, height, 0 ) );
			geometry.vertices.push( new THREE.Vector3( 0, height, 0 ) );

			geometry.faces.push( new THREE.Face3( 0, 1, 2 ) ); // counter-clockwise winding order
			geometry.faces.push( new THREE.Face3( 0, 2, 3 ) );

			return geometry;

		},

		renderScene: function() {

			//requestAnimationFrame( App.stage.renderScene );
			App.stage.renderer.render( App.stage.scene, App.stage.camera );
		}

	};

})();