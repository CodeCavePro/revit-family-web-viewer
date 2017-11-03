import { Scene, WebGLRenderer, OrbitControls, PerspectiveCamera, Vector3 } from 'three';
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
        this.camera = new PerspectiveCamera(
            25,                                     // fov — Camera frustum vertical field of view.
            window.innerWidth / window.innerHeight, // spect — Camera frustum aspect ratio.
            1,                                      // near — Camera frustum near plane.
            1000000                                 // far — Camera frustum far plane.
        );

        this.model = null;
        this.lights = null;
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
        this.camera.position = newCameraPosition;
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
            .then(function (object3D) {

                this.model = new Model( object3D );

                this.lights = new Lights( this.model.boundingSphere );
                this.lights.addToScene( this.model.pivot ); // addToScene( this.scene );

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
    render() {
        this.orbitControls.update();
        requestAnimationFrame( this.render );
        this.renderer.render( this.scene, this.orbitControls.object );
    };
}
