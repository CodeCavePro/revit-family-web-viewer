
var RWV = {
    scene                   : {},                       // scene allows you to set up what and where is to be rendered by three.js
    renderer                : {},                       // WebGL scene renderer
    orbitControls           : {},                       // orbit controls object
    clock                   : new THREE.Clock(),        // Set up clock. Perspective camera uses it
    loader                  : new THREE.ObjectLoader(), // a loader for loading a JSON resource
    camera                  : new THREE.PerspectiveCamera(
        25,                                             // fov — Camera frustum vertical field of view.
        window.innerWidth / window.innerHeight,         // spect — Camera frustum aspect ratio.
        1,                                              // near — Camera frustum near plane.
        1000000                                         // far — Camera frustum far plane.
    ),
    lights: {
        hemisphereLight     : {},                       // hemisphere light for the scene
        sunLight            : {},                       // a directional representing the sun

        ambientLightColor   : '#303030',                // ambient light color
        ambientLight        : {},                       // ambient light for the scene
        
        spotlightsColor     : '#606060',                // spotlight color
        spotLights          : [],                       // an array of directional lights to provide even coverage of the scene
    },
    model: {
        object              : {},                       // Revit 3D model, provides a set of properties and methods for manipulating objects in 3D space
        pivot               : {},                       // needed for rotation
        geometry            : {},                       // the geometry of currently loaded object
        boundingSphere      : {},                       // bounding sphere that encompasses everything in the scene
        boundingBox         : {},                       // bounding box for the Geometry, which can be calculated with
    },
    options: {
        background: {
            enabled         : false,
            color           : 'linear-gradient(141deg, #0fb8ad 0%, #1fc8db 51%, #2cb5e8 75%)'
        },
        rotation: {
            enabled         : false,
            speed           : 0.0015
        },
        originToCenter      : false,
    },
};

// initializes WebGL renderer and orbit controls
RWV.init = function(viewerDiv) {

    // Set background color of the body element if needed
    if (RWV.options.background.enabled) {
        document.getElementsByTagName("body")[0].style.background = RWV.options.background.color;
    }

    RWV.renderer = new THREE.WebGLRenderer(  // the WebGL renderer displays your beautifully crafted scenes using WebGL. 
        {
            alpha           : true,
            antialias       : true,
            maxLights       : 5
        }
    );

    // tweaking the renderer object
    RWV.renderer.setClearColor( 0x000000, 0.0 );
    RWV.renderer.setSize( window.innerWidth, window.innerHeight );
    RWV.renderer.shadowMap.enabled = false;
    viewerDiv.append( RWV.renderer.domElement );

    // tweaking camera object
    RWV.camera.position.set( -window.innerHeight, window.innerHeight / 6, -window.innerHeight );

    // set up orbit controls object
    RWV.orbitControls = new THREE.OrbitControls( RWV.camera, RWV.renderer.domElement );

    RWV.bindEvents();
    RWV.triggerRender();
};

// bind global document / window events
RWV.bindEvents = function() {
    // Bind window resize event
    window.addEventListener('resize', function() {
        RWV.orbitControls.object.aspect = window.innerWidth / window.innerHeight;
        RWV.orbitControls.object.updateProjectionMatrix();

        RWV.camera.aspect = window.innerWidth / window.innerHeight;
        RWV.camera.updateProjectionMatrix();
    
        RWV.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false);
};

// starts three.js renderer
RWV.triggerRender = function() {
    RWV.orbitControls.update( RWV.clock.getDelta() );
    requestAnimationFrame( RWV.triggerRender );
    RWV.renderer.render( RWV.scene, RWV.orbitControls.object );

    if (RWV.model.pivot && RWV.model.pivot.rotation && RWV.options.rotation.enabled && RWV.options.rotation.speed !== 0.0) {
        RWV.model.pivot.rotation.y = RWV.model.pivot.rotation.y - RWV.options.rotation.speed;
    }
};

// this function is called when the JSON model's content has been loaded successfully
RWV.loader.loadSuccess = function(jsonModel) {
    console.log( 'The model has been loaded successful' );

    RWV.scene = new THREE.Scene();
    RWV.model.object = RWV.loader.parse( jsonModel );
    RWV.model.pivot = new THREE.Object3D();
    RWV.model.pivot.add( RWV.model.object );
    RWV.scene.add( RWV.model.pivot );

    // Compute bounding box for geometry-related operations and bounding sphere for lights
    RWV.model.getBoundingFigures();

    if (RWV.options.originToCenter || RWV.options.rotation.enabled) {
        var modelWidth = RWV.model.boundingBox.max.x - RWV.model.boundingBox.min.x;
        var modelHeight = RWV.model.boundingBox.max.z - RWV.model.boundingBox.min.z;
        RWV.model.object.traverse( function ( child ) {            
            if ( ! ( child instanceof THREE.Mesh ) ) return false;
            child.geometry.translate(modelWidth / 2, 0, modelHeight / 2);          
        });
    
        // Re-compute bounds after moving the object
        RWV.model.getBoundingFigures();
    }

    RWV.camera.fit();
    RWV.lights.create();

};

// this function is called when the JSON model's content failed to load
RWV.loader.loadFailed = function() {
    console.log( 'Failed to load JSON model' );
};

// loads JSON model from URL
RWV.loader.loadFromUrl = function(jsonUrl) {
    console.log( 'Loading JSON model from the following URL: ' + jsonUrl );
    jQuery.ajax(
        {
            url         : jsonUrl,
            method      : "GET",
            dataType    : "json",
            cache       : false,
            success     : RWV.loader.loadSuccess,
            error       : RWV.loader.loadFailed,
        }
    );
};

RWV.model.getBoundingFigures = function() {
    //loop over the children of the THREE scene, merge them into a mesh,
    //and compute a bounding sphere for the scene
    var geometry = new THREE.Geometry();
    RWV.scene.traverse( function(child) {
        if(child instanceof THREE.Mesh) {
            geometry.merge( child.geometry );
        }
    });

    //expand the scope of the bounding sphere
    geometry.computeBoundingSphere();
    RWV.model.boundingSphere = geometry.boundingSphere;

    geometry.computeBoundingBox();
    RWV.model.boundingBox = geometry.boundingBox;

    RWV.model.geometry = geometry;
};

RWV.camera.fit = function() {
    //point the camera at the center of the sphere
    RWV.orbitControls.target = RWV.model.boundingSphere.center;

    var zAxis = new THREE.Vector3(0,0,1);
    var direction = zAxis.applyQuaternion(RWV.orbitControls.object.quaternion);
    var offset = RWV.model.boundingSphere.radius / Math.tan(Math.PI / 180.0 * RWV.orbitControls.object.fov * 0.5);
    direction.multiplyScalar(offset * 1.25);

    var newCameraPosition = new THREE.Vector3();
    newCameraPosition.addVectors(RWV.model.boundingSphere.center, direction);
    RWV.camera.position.set(newCameraPosition.x, newCameraPosition.y, newCameraPosition.z);
    RWV.camera.position = newCameraPosition;
};

RWV.lights.create = function() {
    console.log('Creating lights');

    var offset = RWV.model.boundingSphere.radius * 6; // get the radius of the bounding sphere for placing lights at certain distance from the object
    var center = RWV.model.boundingSphere.center; // get the center of the bounding sphere for pointing lights at it

    // the sun as directional light
    RWV.lights.sunLight = new THREE.DirectionalLight( RWV.lights.spotlightsColor );
    RWV.lights.sunLight.name = "The sun :)";
    RWV.lights.sunLight.position.set( center.x + offset, center.y + offset, -center.z-offset );
    RWV.lights.sunLight.position.multiplyScalar( 50);
    RWV.lights.sunLight.target.position.set( center.x, center.y, center.z );
    RWV.scene.add( RWV.lights.sunLight );

    // create a global ambient light object
    RWV.lights.ambientLight = new THREE.AmbientLight( RWV.lights.ambientLightColor );
    RWV.lights.ambientLight.name = "Regular ambient light";
    RWV.scene.add( RWV.lights.ambientLight );

    // create a hemisphere light object
    RWV.lights.hemisphereLight = new THREE.HemisphereLight(0x303030, 0x909090, 0.75);
    RWV.lights.hemisphereLight.position.set( center.x + offset, center.y + offset, center.z + offset );
    RWV.scene.add(RWV.lights.hemisphereLight);

    // create 2 spotlights
    var spotLight1 = new THREE.SpotLight( RWV.lights.spotlightsColor, 0.75 );
    spotLight1.position.set( -center.x - offset / 2, center.y + offset / 1.5, -center.z - offset / 2 );
    spotLight1.target.position.set( center.x, center.y, center.z );
    RWV.scene.add(spotLight1);
    RWV.lights.spotLights.push(spotLight1);

    var spotLight2 = new THREE.SpotLight( RWV.lights.spotlightsColor, 0.75 );
    spotLight2.position.set( center.x + offset / 2, center.y + offset / 1.5, -center.z - offset / 2 );
    spotLight2.target.position.set( center.x, center.y, center.z );
    RWV.scene.add( spotLight2 );
    RWV.lights.spotLights.push(spotLight2);
};
