
viewer.init(document.getElementById('main'));                       // Set HTML host element
var modelJSON = (window.location.hash) ? window.location.hash.split('#')[1] : '6-Burner_Gas_Stove';
viewer.loadModelFromUrl('./dist/models/' + modelJSON + '.json');   // Load the model from JSON file

console.log('Revit Web Viewer has been initialized successfully!');
