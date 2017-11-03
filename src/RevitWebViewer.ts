import { Clock, Scene, WebGLRenderer, OrbitControls, PerspectiveCamera } from 'three';
import { RevitModel } from "./RevitModel";

/**
 * The main Revit Web Viewer class 
 * @class RevitWebViewer
 */
class RevitWebViewer {
    clock                   : Clock;              // Set up clock. Perspective camera uses it
    scene                   : Scene;              // scene allows you to set up what and where is to be rendered by three.js
    renderer                : WebGLRenderer;      // WebGL scene renderer
    orbitControls           : OrbitControls;      // orbit controls object
    camera                  : PerspectiveCamera;  // perspective camera is designed to mimic the way the human eye sees

    model                   : RevitModel;

    /**
     * Creates an instance of RevitWebViewer.
     * @memberof RevitWebViewer
     */
    constructor() {
        this.clock = new Clock();
        this.clock = new Clock();
        this.camera = new PerspectiveCamera(
            25,                                          // fov — Camera frustum vertical field of view.
            window.innerWidth / window.innerHeight,      // spect — Camera frustum aspect ratio.
            1,                                           // near — Camera frustum near plane.
            1000000                                      // far — Camera frustum far plane.
        );

        this.model = new RevitModel();
    }
}

export {RevitWebViewer};