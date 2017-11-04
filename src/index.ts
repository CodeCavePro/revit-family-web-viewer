import { WebViewer } from './WebViewer';
import { WebViewerOptions } from './WebViewerOptions';

let rwv = new WebViewer();
rwv.options = new WebViewerOptions(
    'linear-gradient(141deg, #5D8CAE 0%, #317589 51%, #4D8FAC 75%)',
    true,
    0.0035
);
rwv.init( document.getElementById('main') );
rwv.loadModelFromUrl( './dist/models/6-Burner_Gas_Stove.json' );
console.log('Revit Web Viewer has been initialized successfully!');
