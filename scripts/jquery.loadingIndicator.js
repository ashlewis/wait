/**
 * LoadingIndicator v1.0 jQuery Plugin
 *
 *
 * Adds loading indicator and overlay to provide user feedback and prevent duplicate submissions.
 * 
 * Default plugin behaviour is to display overlay element and disable submit button on form submit. e.g.
 * $('form').loadingIndicator();
 * 
 * IMPORTANT: double submission should also be handled server side
 * 
 * However, loading indicator may be applied independently of formn submission using public plugin methods. e.g.
 * // on page load
 * $.fn.loadingIndicator('init');
 * // on event start
 * $.fn.loadingIndicator('show');
 * // on event complete
 * $.fn.loadingIndicator('hide');
 *  
 * Requirements
 * jQuery 1.7.1+
 * jquery.bgiframe.min.js (optional: required for ie6 only) http://brandonaaron.net/code/bgiframe/docs/
 * 
 * @param {string/object} method/options - public plugin method or configuration options
 *  - methods {string} [init|show|hide|submit(default)]
 *  - options {string/object} overlayClass   (default:overlay)    // class to be applied to overlay element
 */

// create closure
(function($) {
    
    var 
        $overlay,

        methods = {

            /**
            * Initialize overlay - create and inject overlay element and preload background image
            */
            init: function(options){                
                
                // extend default settings with those provided.
                var settings = $.extend(
                        {},  
                        $.fn.loadingIndicator.defaults,
                        options
                    ),          

                    imagePath;
                 
                 // check whether overlay element is already present on page
                 if (!$('.'+ settings.overlayClass).length) {
                     
                    // create element to overlay form with
                    $overlay = $('<div class="'+ settings.overlayClass +'"/>');

                    // if available use bgiframe fix (ie6 / select list / z-index bug) on overlay element
                    if ($.fn.bgiframe) {
                        $overlay.bgiframe();
                    }

                    // add overlay element to DOM and hide (add to DOM now so we can preload background image)
                    $('body').append($overlay.hide());

                    // preload overlay background image
                    imagePath = $overlay.css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "");
                    $('<img/>')[0].src = imagePath;
                }
            },

            /**
            * Default plugin behaviour - display overlay element and disable submit button on form submit
            */
            submit: function(options){     

                methods.init.apply( this, arguments );

                // iterate each matched element
                return this.each(function() {

                    var $form = $(this);

                    $('body').on('submit', $form, function(e){

                        // disable submit button(s)
                        $('input[type="submit"]', $form).attr({disabled: 'disabled'});

                        // display overlay
                        methods.show.apply( this, arguments );

                    });
                });	
            },

            /*
            * Display overlay
            */
            show: function(){
                // display overlay
                $overlay.show();
            },

            /*
            * Hide overlay
            */
            hide: function(){
                // display overlay
                $overlay.hide();
            }
        };    
    
    $.fn.loadingIndicator = function(methodOrOptions) {
        
        if (methods[methodOrOptions]) {
            
            // call specified method
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
            
        } else if (typeof methodOrOptions === 'object' || ! methodOrOptions) {
            
            // call default "init" method
            return methods.submit.apply( this, arguments );
            
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.loadingIndicator' );
        }    
    };

    // plugin default settings
    $.fn.loadingIndicator.defaults = {
        overlayClass: 'overlay'
    };

// end closure 
})(jQuery);