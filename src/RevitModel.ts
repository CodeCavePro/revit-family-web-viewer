import { ObjectLoader, Object3D, Geometry, Box3, Sphere, Mesh } from 'three';
import * as WebRequest from 'web-request';

class RevitModel {
    object                  : Object3D;             // Revit 3D model, provides a set of properties and methods for manipulating objects in 3D space
    loader                  : ObjectLoader;         // a loader for loading a JSON resource
    geometry                : Geometry;             // the geometry of currently loaded object
    boundingSphere          : Sphere;               // bounding sphere that encompasses everything in the scene
    boundingBox             : Box3;                 // bounding box for the Geometry, which can be calculated with

    constructor() {
        this.object = null;
        this.loader = new ObjectLoader();        
    }

    async loadFromURL(url : string) : Promise<Object3D> {
        let modelData = await WebRequest.get(url);
        let modelJson = JSON.parse(modelData.content);
        return this.loadFromJSON( modelJson );
    }

    loadFromJSON( modelJson : Object) : Object3D {
        this.object = this.loader.parse( modelJson );

        // needed for rotation and other stuff
        let pivot = new Object3D();
        pivot.add(this.object);
        return pivot;
    }

    getBoundingFigures() : void {
        // loop over the children of the THREE scene, merge them into a mesh,
        // and compute a bounding sphere for the scene
        let geometry = new Geometry();
        this.object.traverse( function(child) {
            if(child instanceof Mesh && child.geometry instanceof Geometry) {
                geometry.merge( child.geometry );
            }
        });
    
        // expand the scope of the bounding sphere
        geometry.computeBoundingSphere();
        this.boundingSphere = geometry.boundingSphere;
    
        geometry.computeBoundingBox();
        this.boundingBox = geometry.boundingBox;
    
        this.geometry = geometry;
    };
    
}

export {RevitModel}