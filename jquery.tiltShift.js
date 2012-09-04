/*

 tiltShift.js

 Demo: http://www.noeltock.com/tilt-shift-css3-jquery-plugin/
 Download:
 License: GPL GNU (http://www.gnu.org/licenses/)

 */

(function($) {

    $.fn.tiltShift = function(options) {

		$(this).each(function(){

            // Settings

            var s_position = $(this).data('position');
            var s_blur = $(this).data('blur');
            var s_focus = $(this).data('focus');
            var s_falloff = $(this).data('falloff');
            var s_direction = $(this).data('direction');

            // Setup DOM around Image (ugly but flexible)

            $(this).wrap('<div class="tiltshift-wrap" />');
            $(this).parent().prepend('<div class="tiltshift-before tiltshift-layer"></div>');
            $(this).parent().append('<div class="tiltshift-after tiltshift-layer"></div>');

            // Grab original image and assign to before & after

            var src = $(this).attr("src");
            $(this).parent().find('.tiltshift-layer').css('background-image', 'url(' + src + ')');

			// Set Blur

            $(this).parent().find('.tiltshift-layer').css({
                '-webkit-filter': 'blur(' + s_blur + 'px)'
            });

            // Calculate Focus Boundaries (impacted by inFocus value)

            var beforeEnd = ( s_position - ( s_focus / 2 ) ) / 100;
            var afterEnd = ( ( 100 - s_position ) - ( s_focus / 2 ) ) / 100;

            // Calculate Falloff Breakpoints (impacted by tightness value)

            var beforeFall = ( ( beforeEnd ) - ( s_falloff / 100 ) ).toFixed(2);
            var afterFall = ( ( afterEnd ) - ( s_falloff / 100 ) ).toFixed(2);

            // Set directional variables

            if ( s_direction == 'y' ) {
                var beforeDirection = 'left top, left bottom';
                var afterDirection = 'left bottom, left top';
            } else {
                var beforeDirection = 'left top, right top';
                var afterDirection = 'right top, left top';
            }

            // Apply Gradient Mask to Image Layers

            $(this).parent().find('.tiltshift-before').css({
                '-webkit-mask-image' : '-webkit-gradient(linear, ' + beforeDirection + ', color-stop(0, rgba(0,0,0,1)), color-stop(' + beforeFall + ', rgba(0,0,0,1)), color-stop(' + beforeEnd + ', rgba(0,0,0,0)))'
            });

            $(this).parent().find('.tiltshift-after').css({
                '-webkit-mask-image' : '-webkit-gradient(linear, ' + afterDirection + ', color-stop(0, rgba(0,0,0,1)), color-stop(' + afterFall + ', rgba(0,0,0,1)), color-stop(' + afterEnd + ', rgba(0,0,0,0)))'
            });

		});

    };

})(jQuery);