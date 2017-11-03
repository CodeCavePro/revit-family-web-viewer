import { SpotLight, DirectionalLight, HemisphereLight, AmbientLight, Sphere, Object3D, Scene } from 'three';

export class Lights {

    static readonly lightColorDark      = '#303030';
    static readonly lightColorNeutral   = '#606060';
    static readonly lightColorBright    = '#909090';
    static readonly lightOpacity        = 0.75;

    ambientLight                        : AmbientLight;         // ambient light for the scene
    hemisphereLight                     : HemisphereLight;      // hemisphere light for the scene
    sunLight                            : DirectionalLight;     // a directional representing the sun
    spotLights                          : SpotLight[];          // an array of directional lights to provide even coverage of the scene

    constructor( boundingSphere : Sphere ) {

        var offset = boundingSphere.radius * 6;     // get the radius of the bounding sphere for placing lights at certain distance from the object
        var center = boundingSphere.center;         // get the center of the bounding sphere for pointing lights at it
    
        // the sun as directional light
        this.sunLight = new DirectionalLight( Lights.lightColorBright );
        this.sunLight.name = "The sun :)";
        this.sunLight.position.set( center.x + offset, center.y + offset, -center.z-offset );
        this.sunLight.position.multiplyScalar( 50 );
        this.sunLight.target.position.set( center.x, center.y, center.z );

        // create a global ambient light object
        this.ambientLight = new AmbientLight( Lights.lightColorDark );
        this.ambientLight.name = "Mild ambient light";

        // create a hemisphere light object
        this.hemisphereLight = new HemisphereLight( Lights.lightColorDark, Lights.lightColorBright, Lights.lightOpacity );
        this.hemisphereLight.name = "Mild hemisphere light";
        this.hemisphereLight.position.set( center.x + offset, center.y + offset, center.z + offset );

        let spotLight1 = new SpotLight( Lights.lightColorNeutral, Lights.lightOpacity );
        spotLight1.position.set( -center.x - offset / 2, center.y + offset / 1.5, -center.z - offset / 2 );
        spotLight1.target.position.set( center.x, center.y, center.z );

        let spotLight2 = new SpotLight( Lights.lightColorNeutral, Lights.lightOpacity );
        spotLight2.position.set( center.x + offset / 2, center.y + offset / 1.5, -center.z - offset / 2 );
        spotLight2.target.position.set( center.x, center.y, center.z );

        // create 2 spotlights
        this.spotLights = [ spotLight1, spotLight2 ];
    }

    addToScene( scene : Object3D | Scene ) {
        scene.add( this.sunLight );
        scene.add( this.ambientLight );
        scene.add( this.hemisphereLight );
        this.spotLights.forEach(spotLight => {
            scene.add( spotLight );
        });
    }
}
