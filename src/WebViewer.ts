import { Scene, WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { Model } from "./Model";
import { Lights } from "./Lights";

/**
 * The main Revit Web Viewer class
 * @class RevitWebViewer
 */
export class WebViewer {
    scene                   : Scene;                // scene allows you to set up what and where is to be rendered by three.js
    renderer                : WebGLRenderer;        // WebGL scene renderer
    orbitControls           : OrbitControls;        // orbit controls object
    camera                  : PerspectiveCamera;    // perspective camera is designed to mimic the way the human eye sees
    model                   : Model;
    lights                  : Lights;

    /**
     * Creates an instance of RevitWebViewer.
     * @memberof RevitWebViewer
     */
    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(
            25,                                     // fov — Camera frustum vertical field of view.
            window.innerWidth / window.innerHeight, // spect — Camera frustum aspect ratio.
            1,                                      // near — Camera frustum near plane.
            1000000                                 // far — Camera frustum far plane.
        );

        this.renderer = new WebGLRenderer(          // the WebGL renderer displays your beautifully crafted scenes using WebGL. 
            {
                alpha           : true,
                antialias       : true
            }
        );

        this.model = null;
        this.lights = null;
    };

    init( element : HTMLElement ) : void {

        // tweaking the renderer object
        this.renderer.setClearColor( 0x000000, 0.0 );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = false;

        // tweaking camera object
        this.camera.position.set( -window.innerHeight, window.innerHeight / 6, -window.innerHeight );

        // set up orbit controls object
        this.orbitControls = new OrbitControls( this.camera, this.renderer.domElement );
        this.orbitControls.enableZoom = true;
        this.orbitControls.zoomSpeed = 1.0;
        this.orbitControls.enablePan = true; // Set to false to disable panning (ie vertical and horizontal translations) 

        // tweak orbit controls in order to uncover the "top edge" of the object
        this.orbitControls.target.set( 0, -window.innerHeight / 2, 0 );

        element.appendChild( this.renderer.domElement );

        this.bindEvents();
        this.render();
    }

    /**
     * Tweak orbit controls and camepra position
     * @memberof WebViewer
     */
    tweakCameraAndControls() : void {
        // point the camera at the center of the sphere
        this.orbitControls.target = this.model.boundingSphere.center;
    
        let zAxis = new Vector3( 0, 0, 1 );
        let direction = zAxis.applyQuaternion( this.orbitControls.object.quaternion );
        let offset = this.model.boundingSphere.radius / Math.tan( Math.PI / 180.0 * (<PerspectiveCamera> this.orbitControls.object).fov * 0.5 );
        direction.multiplyScalar( offset * 1.25 );
    
        let newCameraPosition = new Vector3();
        newCameraPosition.addVectors( this.model.boundingSphere.center, direction );
        this.camera.position.set( newCameraPosition.x, newCameraPosition.y, newCameraPosition.z );
    };

    /**
     * Bind global document / window events
     * @memberof WebViewer
     */
    bindEvents() {
        // window resize event
        window.addEventListener('resize', () => {
            (<PerspectiveCamera> this.orbitControls.object).aspect = window.innerWidth / window.innerHeight;
            (<PerspectiveCamera> this.orbitControls.object).updateProjectionMatrix();

            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }, false);
    };

    loadModelFromUrl( url : string ) : void {

        Model.loadFromURL(url)
            .then((object3D) => {
                this.scene = new Scene();
                this.model = new Model( object3D );

                this.lights = new Lights( this.model.boundingSphere );
                this.lights.addToScene( this.scene ); // addToScene( this.scene );

                this.scene.add( this.model.pivot ); // add( this.model.object );

                this.tweakCameraAndControls();
             })
            .catch(function (err) {
                // TODO handle the error
                console.log( err );
            });
    };

    /**
     * Render the scene via three.js renderer
     * @memberof WebViewer
     */
    render = () => {
        this.orbitControls.update();
        requestAnimationFrame( this.render );
        this.renderer.render( this.scene, this.orbitControls.object );
    };
}
