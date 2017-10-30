
var RWV = {
    scene                   : new THREE.Scene(),        // scene allows you to set up what and where is to be rendered by three.js
    loader                  : new THREE.ObjectLoader(), // a loader for loading a JSON resource
    camera                  : new THREE.PerspectiveCamera(
        25,                                             // fov — Camera frustum vertical field of view.
        window.innerWidth / window.innerHeight,         // spect — Camera frustum aspect ratio.
        1,                                              // near — Camera frustum near plane.
        1000000                                         // far — Camera frustum far plane.
    ),
    orbitControls           : {},                       // orbit controls object
    clock                   : new THREE.Clock(),        // Set up clock. Perspective camera uses it
    renderer                : new THREE.WebGLRenderer(  // the WebGL renderer displays your beautifully crafted scenes using WebGL. 
        {
            domElement      : document.getElementById('main').getElementsByClassName('output canvas'),
            alpha           : true,
            antialias       : true,
            maxLights       : 5
        }
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