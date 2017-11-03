import { WebViewer } from './WebViewer';

let rwv = new WebViewer();
rwv.init( document.getElementById('main') );
rwv.loadModelFromUrl( './dist/assets/models/6-Burner_Gas_Stove.json' );
console.log('Revit Web Viewer has been initialized successfully!');
