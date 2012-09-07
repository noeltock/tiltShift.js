/*

 tiltShift.js

 Demo: http://www.noeltock.com/tilt-shift-css3-jquery-plugin/
 Download: https://github.com/noeltock/tiltShift.js/
 License: GPL GNU (http://www.gnu.org/licenses/)

 */

// Workaround for 'use strict' mode

var define = define || undefined;

(function(window, $, define, undefined) {

    'use strict';

    var TiltShift = function(el, settings) {
        this.$el = $(el);
        this.settings = settings;
        this.$wrap = null;

        return this;
    };

    TiltShift.prototype.tilt = function(options) {
        // Settings

        options || ( options = this.$el.data() );

        var $this = this.$el,
            $parent = $this.parent(),
            s_position = options.position || $this.data('position'),
            s_blur =  options.blur || $this.data('blur'),
            s_focus = options.focus || $this.data('focus'),
            s_falloff = options.falloff || $this.data('falloff'),
            s_direction = ( options.direction || $this.data('direction') ).toLowerCase(),
            beforeEnd,
            afterEnd,
            beforeFall,
            afterFall,
            beforeDirection,
            afterDirection,
            angle;

        // Don't re-shift

        if( !this.$wrap && !$parent.hasClass('tiltshift-wrap') ) {

            // Setup DOM around Image (ugly but flexible)

            this.$wrap = this.wrap();

            // Grab original image and assign to before & after

            $parent.find('.tiltshift-layer').css('background-image', 'url(' + $this.attr('src') + ')');

            // Set Blur

            $parent.find('.tiltshift-layer').css({
                '-webkit-filter': 'blur(' + s_blur + 'px) contrast(115%) saturate(103%)'
            });
        }

        // Calculate Focus Boundaries (impacted by inFocus value)

        beforeEnd = ( s_position - ( s_focus / 2 ) ) / 100;
        afterEnd = ( ( 100 - s_position ) - ( s_focus / 2 ) ) / 100;

        // Calculate Falloff Breakpoints (impacted by tightness value)

        beforeFall = ( ( beforeEnd - ( s_falloff / 100 ) ) * 100 ).toFixed(2);
        afterFall = ( ( afterEnd - ( s_falloff / 100 ) ) * 100 ).toFixed(2);

        // Adjust back up to integers for gradient format

        beforeEnd *= 100;
        afterEnd *= 100;

        // Set directional variables

        if ( s_direction === 'y' ) {
            beforeDirection = '270deg';
            afterDirection = '90deg';
        } else if ( s_direction === 'x' ) {
            beforeDirection = '180deg';
            afterDirection = '0deg';
        } else {
            angle = s_direction % 360;

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
    };

    TiltShift.prototype.untilt =  function() {
        var $parent = this.$el.parent();

        $parent.find('.tiltshift-layer').remove();

        this.$el.unwrap();
    };

    TiltShift.prototype.wrap = function() {
        var $wrap;

        $wrap = this.$el.wrap('<div class="tiltshift-wrap" />').parent();
        $wrap.prepend('<div class="tiltshift-before tiltshift-layer" />');
        $wrap.append('<div class="tiltshift-after tiltshift-layer" />');

        return $wrap;
    };

    window.TiltShift = TiltShift;

    if ( define && typeof define === 'function' && define.amd ) {
        define( 'tiltshift', [], function () { return TiltShift; } );
    }
})(window, jQuery, define );

(function($, TiltShift) {

    'use strict';

    var cachedShifts = {};

    $.fn.tiltShift = function(options) {
        
        var shifted = [];

        $(this).each(function(){
            var $this = $(this),
                ts = (cachedShifts[this.src]) ? cachedShifts[this.src] : new TiltShift( $this, $this.data() );

            if(options && options.reset) {
                ts.untilt();
                delete cachedShifts[this.src];
            } else {
                ts.tilt();
                cachedShifts[this.src] = ts;
            }

            shifted.push( ts );
        });

        return shifted;

    };

})(jQuery, TiltShift);