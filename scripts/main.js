$(function(){   
    $.fn.loadingIndicator('init');
    // apply custom plugin
    $('form').not('.no-prevent-double-submit').loadingIndicator();
});