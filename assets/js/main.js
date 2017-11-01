jQuery(document).ready(function($) {
    var canvasElement = document.getElementById('main');
    RWV.init(canvasElement);

    var jsonUrl = './assets/models/6-Burner_Gas_Stove.json';
    RWV.loader.loadFromUrl(jsonUrl);
});