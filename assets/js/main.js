jQuery(document).ready(function($) {
    var canvasElement = document.getElementById('main');
    RWV.options.background.enabled = true;
    RWV.options.rotation = {
        enabled : true,
        speed   : -0.01
    };
    RWV.init(canvasElement);

    var jsonUrl = './assets/models/6-Burner_Gas_Stove.json';
    RWV.loader.loadFromUrl(jsonUrl);
});