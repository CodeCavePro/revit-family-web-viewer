import { WebViewer } from './WebViewer';

let rwv = new WebViewer();
let canvasElement = document.getElementById('main'); 
rwv.init( canvasElement );

let jsonUrl = 'dist/assets/models/6-Burner_Gas_Stove.json'; 
rwv.loadModelFromUrl( jsonUrl ); 

console.log('Revit Web Viewer has been initialized successfully!');
