/*

 tiltShift.js

 Demo: http://www.noeltock.com/tilt-shift-css3-jquery-plugin/
 Download: https://github.com/noeltock/tiltShift.js/
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

            var $wrap = $this.wrap('<div class="tiltshift-wrap" />').parent();
            $wrap.prepend('<div class="tiltshift-before tiltshift-layer" />');
            $wrap.append('<div class="tiltshift-after tiltshift-layer" />');

            // Grab original image and assign to before & after

            var src = $this.attr('src');
            $parent.find('.tiltshift-layer').css('background-image', 'url(' + src + ')');

            // Set Blur

            $parent.find('.tiltshift-layer').css({
                '-webkit-filter': 'blur(' + s_blur + 'px) contrast(105%) saturate(105%)'
            });

            // Calculate Focus Boundaries (impacted by inFocus value)

            var beforeEnd = ( s_position - ( s_focus / 2 ) ) / 100;
            var afterEnd = ( ( 100 - s_position ) - ( s_focus / 2 ) ) / 100;

            // Calculate Falloff Breakpoints (impacted by tightness value)

            var beforeFall = ( ( beforeEnd - ( s_falloff / 100 ) ) * 100 ).toFixed(2);
            var afterFall = ( ( afterEnd - ( s_falloff / 100 ) ) * 100 ).toFixed(2);

            // Adjust back up to integers for gradient format

            beforeEnd *= 100;
            afterEnd *= 100;

            // Set directional variables

            var beforeDirection, afterDirection;

            if ( s_direction === 'y' ) {
                beforeDirection = '270deg';
                afterDirection = '90deg';
            } else if ( s_direction === 'x' ) {
                beforeDirection = '180deg';
                afterDirection = '0deg';
            } else {
                var angle = s_direction % 360;

                beforeDirection = (angle + 180) + 'deg';
                afterDirection = angle + 'deg';
            }

            // Apply Gradient Mask to Image Layers

            $parent.find('.tiltshift-before').css({
                '-webkit-mask-image' : '-webkit-linear-gradient(' + beforeDirection + ', rgba(0,0,0,1) 0, rgba(0,0,0,1) ' + beforeFall + '%, rgba(0,0,0,0) ' + beforeEnd + '%)'
            });

            $parent.find('.tiltshift-after').css({
                '-webkit-mask-image' : '-webkit-linear-gradient(' + afterDirection + ', rgba(0,0,0,1) 0, rgba(0,0,0,1) ' + afterFall + '%, rgba(0,0,0,0) ' + afterEnd + '%)'
            });

        });

    };

})(jQuery);