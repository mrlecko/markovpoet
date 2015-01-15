/*global jQuery */
/*!	
* FitText.js 1.1
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/

(function( $ ){
	
  $.fn.fitText = function( kompressor, options ) {
	   
    // Setup options
    var compressor = kompressor || 1,
        settings = $.extend({
          'minFontSize' : Number.NEGATIVE_INFINITY,
          'maxFontSize' : Number.POSITIVE_INFINITY
        }, options);
	
    return this.each(function(){

      // Store the object
      var $this = $(this); 
        
      // Resizer() resizes items based on the object width divided by the compressor * 10
      var resizer = function () {
        $this.css('font-size', Math.max(Math.min($this.width() / (compressor*10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)));
      };

      // Call once to set.
      resizer();
				
      // Call on resize. Opera debounces their resize by default. 
      $(window).on('resize', resizer);
      	
    });

  };

})( jQuery );


/*global jQuery */
/*!	
* Lettering.JS 0.6.1
*
* Copyright 2010, Dave Rupert http://daverupert.com
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
*
* Thanks to Paul Irish - http://paulirish.com - for the feedback.
*
* Date: Mon Sep 20 17:14:00 2010 -0600
*/
(function($){
	function injector(t, splitter, klass, after) {
		var a = t.text().split(splitter), inject = '';
		if (a.length) {
			$(a).each(function(i, item) {
				inject += '<span class="'+klass+(i+1)+'">'+item+'</span>'+after;
			});	
			t.empty().append(inject);
		}
	}
	
	var methods = {
		init : function() {

			return this.each(function() {
				injector($(this), '', 'char', '');
			});

		},

		words : function() {

			return this.each(function() {
				injector($(this), ' ', 'word', ' ');
			});

		},
		
		lines : function() {

			return this.each(function() {
				var r = "eefec303079ad17405c889e092e105b0";
				// Because it's hard to split a <br/> tag consistently across browsers,
				// (*ahem* IE *ahem*), we replaces all <br/> instances with an md5 hash 
				// (of the word "split").  If you're trying to use this plugin on that 
				// md5 hash string, it will fail because you're being ridiculous.
				injector($(this).children("br").replaceWith(r).end(), r, 'line', '');
			});

		}
	};

	$.fn.lettering = function( method ) {
		// Method calling logic
		if ( method && methods[method] ) {
			return methods[ method ].apply( this, [].slice.call( arguments, 1 ));
		} else if ( method === 'letters' || ! method ) {
			return methods.init.apply( this, [].slice.call( arguments, 0 ) ); // always pass an array
		}
		$.error( 'Method ' +  method + ' does not exist on jQuery.lettering' );
		return this;
	};

})(jQuery);
		
			
// textilate
(function(e){"use strict";function t(t){return/In/.test(t)||e.inArray(t,e.fn.textillate.defaults.inEffects)>=0}function n(t){return/Out/.test(t)||e.inArray(t,e.fn.textillate.defaults.outEffects)>=0}function r(e){if(e!=="true"&&e!=="false")return e;return e==="true"}function i(t){var n=t.attributes||[],i={};if(!n.length)return i;e.each(n,function(e,t){var n=t.nodeName.replace(/delayscale/,"delayScale");if(/^data-in-*/.test(n)){i.in=i.in||{};i.in[n.replace(/data-in-/,"")]=r(t.nodeValue)}else if(/^data-out-*/.test(n)){i.out=i.out||{};i.out[n.replace(/data-out-/,"")]=r(t.nodeValue)}else if(/^data-*/.test(n)){i[n.replace(/data-/,"")]=r(t.nodeValue)}});return i}function s(e){for(var t,n,r=e.length;r;t=parseInt(Math.random()*r),n=e[--r],e[r]=e[t],e[t]=n);return e}function o(e,t,n){e.addClass("animated "+t).css("visibility","visible").show();e.one("animationend webkitAnimationEnd oAnimationEnd",function(){e.removeClass("animated "+t);n&&n()})}function u(r,i,u){var a=this,f=r.length;if(!f){u&&u();return}if(i.shuffle)r=s(r);if(i.reverse)r=r.toArray().reverse();e.each(r,function(r,s){function l(){if(t(i.effect)){a.css("visibility","visible")}else if(n(i.effect)){a.css("visibility","hidden")}f-=1;if(!f&&u)u()}var a=e(s);var c=i.sync?i.delay:i.delay*r*i.delayScale;a.text()?setTimeout(function(){o(a,i.effect,l)},c):l()})}var a=function(r,s){var o=this,a=e(r);o.init=function(){o.$texts=a.find(s.selector);if(!o.$texts.length){o.$texts=e('<ul class="texts"><li>'+a.html()+"</li></ul>");a.html(o.$texts)}o.$texts.hide();o.$current=e("<span>").html(o.$texts.find(":first-child").html()).prependTo(a);if(t(s.in.effect)){o.$current.css("visibility","hidden")}else if(n(s.out.effect)){o.$current.css("visibility","visible")}o.setOptions(s);o.timeoutRun=null;setTimeout(function(){o.options.autoStart&&o.start()},o.options.initialDelay)};o.setOptions=function(e){o.options=e};o.triggerEvent=function(t){var n=e.Event(t+".tlt");a.trigger(n,o);return n};o.in=function(r,s){r=r||0;var a=o.$texts.find(":nth-child("+((r||0)+1)+")"),f=e.extend(true,{},o.options,a.length?i(a[0]):{}),l;a.addClass("current");o.triggerEvent("inAnimationBegin");o.$current.html(a.html()).lettering("words");if(o.options.type=="char"){o.$current.find('[class^="word"]').css({display:"inline-block","-webkit-transform":"translate3d(0,0,0)","-moz-transform":"translate3d(0,0,0)","-o-transform":"translate3d(0,0,0)",transform:"translate3d(0,0,0)"}).each(function(){e(this).lettering()})}l=o.$current.find('[class^="'+o.options.type+'"]').css("display","inline-block");if(t(f.in.effect)){l.css("visibility","hidden")}else if(n(f.in.effect)){l.css("visibility","visible")}o.currentIndex=r;u(l,f.in,function(){o.triggerEvent("inAnimationEnd");if(f.in.callback)f.in.callback();if(s)s(o)})};o.out=function(t){var n=o.$texts.find(":nth-child("+((o.currentIndex||0)+1)+")"),r=o.$current.find('[class^="'+o.options.type+'"]'),s=e.extend(true,{},o.options,n.length?i(n[0]):{});o.triggerEvent("outAnimationBegin");u(r,s.out,function(){n.removeClass("current");o.triggerEvent("outAnimationEnd");if(s.out.callback)s.out.callback();if(t)t(o)})};o.start=function(e){setTimeout(function(){o.triggerEvent("start");(function t(e){o.in(e,function(){var n=o.$texts.children().length;e+=1;if(!o.options.loop&&e>=n){if(o.options.callback)o.options.callback();o.triggerEvent("end")}else{e=e%n;o.timeoutRun=setTimeout(function(){o.out(function(){t(e)})},o.options.minDisplayTime)}})})(e||0)},o.options.initialDelay)};o.stop=function(){if(o.timeoutRun){clearInterval(o.timeoutRun);o.timeoutRun=null}};o.init()};e.fn.textillate=function(t,n){return this.each(function(){var r=e(this),s=r.data("textillate"),o=e.extend(true,{},e.fn.textillate.defaults,i(this),typeof t=="object"&&t);if(!s){r.data("textillate",s=new a(this,o))}else if(typeof t=="string"){s[t].apply(s,[].concat(n))}else{s.setOptions.call(s,o)}})};e.fn.textillate.defaults={selector:".texts",loop:false,minDisplayTime:2e3,initialDelay:0,"in":{effect:"fadeInLeftBig",delayScale:1.5,delay:50,sync:false,reverse:false,shuffle:false,callback:function(){}},out:{effect:"hinge",delayScale:1.5,delay:50,sync:false,reverse:false,shuffle:false,callback:function(){}},autoStart:true,inEffects:[],outEffects:["hinge"],callback:function(){},type:"char"}})(jQuery)
