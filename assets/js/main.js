jQuery(document).ready(function($) {
    var canvasElement = document.getElementById('main');
    RWV.options.background.enabled = true;
    RWV.options.originToCenter = true;
    RWV.init(canvasElement);

    var jsonUrl = './assets/models/6-Burner_Gas_Stove.json';
    RWV.loader.loadFromUrl(jsonUrl);
});