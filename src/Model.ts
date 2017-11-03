import { ObjectLoader, Object3D, Geometry, BufferGeometry, Box3, Sphere, Mesh } from 'three';
import * as WebRequest from 'web-request';

/**
 * Wraps all model-related functionality
 * @class RevitModel
 */
export class Model {
    static readonly loader  = new ObjectLoader();   // a loader for loading a JSON resource

    object                  : Object3D;             // Revit 3D model, provides a set of properties and methods for manipulating objects in 3D space
    pivot                   : Object3D;             // needed for rotation and other stuff 
    geometry                : Geometry;             // the geometry of currently loaded object
    boundingSphere          : Sphere;               // bounding sphere that encompasses everything in the scene
    boundingBox             : Box3;                 // bounding box for the Geometry, which can be calculated with

    /**
     * Creates an instance of RevitModel.
     * @memberof RevitModel
     */
    constructor( object3D : Object3D ) {
        this.object = object3D;
        this.pivot = new Object3D();
        this.pivot.add( this.object );

        // Compute bounding box for geometry-related operations
        // and bounding sphere for lights
        this.getBoundingFigures();
    }

    /**
     * Loads model object from URL
     * @param {string} url 
     * @returns {Promise<Object3D>} 
     * @memberof RevitModel
     */
    static async loadFromURL(url : string) : Promise<Object3D> {
        let modelData = await WebRequest.get(url);
        let modelJson = JSON.parse(modelData.content);
        return Model.loadFromJSON( modelJson );
    }

    /**
     * Loads model object from a JSON object
     * @param {Object} modelJson 
     * @returns {Object3D} 
     * @memberof RevitModel
     */
    static loadFromJSON( modelJson : Object) : Object3D {
        try {
            let object = Model.loader.parse( modelJson );
            return object;
        } catch {
            return null;
        }
    }

    /**
     * Loops over the children of the THREE scene, merge them into a mesh,
     * and compute a bounding sphere for the scene
     * @memberof RevitModel
     */
    getBoundingFigures() : void {
        let geometry = new Geometry();
        this.object.traverse( (child) => {
            if(child instanceof Mesh ) {
                if (child.geometry instanceof Geometry) {
                    geometry.merge( child.geometry );
                } else if (child.geometry instanceof BufferGeometry) {
                    let convertedGeometry = new Geometry();
                    convertedGeometry.fromBufferGeometry(child.geometry);
                    geometry.merge( convertedGeometry );
                }
            }
        });

        geometry.computeBoundingSphere();
        this.boundingSphere = geometry.boundingSphere;

        geometry.computeBoundingBox();
        this.boundingBox = geometry.boundingBox;

        this.geometry = geometry;
    };
}
