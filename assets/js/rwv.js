
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
};

// initializes WebGL renderer and orbit controls
RWV.init = function(canvasElement) {

    RWV.renderer = new THREE.WebGLRenderer(  // the WebGL renderer displays your beautifully crafted scenes using WebGL. 
        {
            domElement      : canvasElement,
            alpha           : true,
            antialias       : true,
            maxLights       : 5
        }
    );

    // tweaking the renderer object
    RWV.renderer.setClearColor( 0x000000, 0.0 );
    RWV.renderer.setSize( window.innerWidth, window.innerHeight );

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
        RWV.camera.position.set( -window.innerHeight, window.innerHeight / 6, -window.innerHeight );
        RWV.camera.updateProjectionMatrix();
    
        RWV.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false);
};

// starts three.js renderer
RWV.triggerRender = function() {
    RWV.orbitControls.update( RWV.clock.getDelta() );
    requestAnimationFrame( RWV.triggerRender );
    RWV.renderer.render( RWV.scene, RWV.orbitControls.object );
};
