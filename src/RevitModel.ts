import { ObjectLoader, Object3D } from 'three';
import * as WebRequest from 'web-request';

class RevitModel {
    object                  : Object3D;             // Revit 3D model, provides a set of properties and methods for manipulating objects in 3D space
    loader                  : ObjectLoader;         // a loader for loading a JSON resource


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
}

export {RevitModel}