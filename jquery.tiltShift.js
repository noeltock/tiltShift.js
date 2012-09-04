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

            var $this = $(this);
            var $parent = $this.parent();
            var s_position = $this.data('position');
            var s_blur = $this.data('blur');
            var s_focus = $this.data('focus');
            var s_falloff = $this.data('falloff');
            var s_direction = $this.data('direction');

            // Setup DOM around Image (ugly but flexible)

            $this.wrap('<div class="tiltshift-wrap" />');
            $parent.prepend('<div class="tiltshift-before tiltshift-layer"></div>');
            $parent.append('<div class="tiltshift-after tiltshift-layer"></div>');

            // Grab original image and assign to before & after

            var src = $this.attr("src");
            $parent.find('.tiltshift-layer').css('background-image', 'url(' + src + ')');

            // Set Blur

            $parent.find('.tiltshift-layer').css({
                '-webkit-filter': 'blur(' + s_blur + 'px)'
            });

            // Calculate Focus Boundaries (impacted by inFocus value)

            var beforeEnd = ( s_position - ( s_focus / 2 ) ) / 100;
            var afterEnd = ( ( 100 - s_position ) - ( s_focus / 2 ) ) / 100;

            // Calculate Falloff Breakpoints (impacted by tightness value)

            var beforeFall = ( ( beforeEnd ) - ( s_falloff / 100 ) ).toFixed(2);
            var afterFall = ( ( afterEnd ) - ( s_falloff / 100 ) ).toFixed(2);

            // Set directional variables
            var beforeDirection, afterDirection;

            if ( s_direction == 'y' ) {
                beforeDirection = 'left top, left bottom';
                afterDirection = 'left bottom, left top';
            } else {
                beforeDirection = 'left top, right top';
                afterDirection = 'right top, left top';
            }

            // Apply Gradient Mask to Image Layers

            $parent.find('.tiltshift-before').css({
                '-webkit-mask-image' : '-webkit-gradient(linear, ' + beforeDirection + ', color-stop(0, rgba(0,0,0,1)), color-stop(' + beforeFall + ', rgba(0,0,0,1)), color-stop(' + beforeEnd + ', rgba(0,0,0,0)))'
            });

            $parent.find('.tiltshift-after').css({
                '-webkit-mask-image' : '-webkit-gradient(linear, ' + afterDirection + ', color-stop(0, rgba(0,0,0,1)), color-stop(' + afterFall + ', rgba(0,0,0,1)), color-stop(' + afterEnd + ', rgba(0,0,0,0)))'
            });

        });

    };

})(jQuery);