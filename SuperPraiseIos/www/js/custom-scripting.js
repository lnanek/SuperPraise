$(document).bind("mobileinit", function(){
    $.mobile.defaultPageTransition = 'none';
    $.mobile.defaultDialogTransition = 'none';
    $.mobile.useFastClick = true;
    
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.phonegapNavigationEnabled = true;
    $.mobile.pushStateEnabled = false;
    $.mobile.ajaxEnabled = false;
});

// For images with class rollover, read their rel attribute for an alternate image to show on rollover.
var AUTO_MOUSE_OUT_MS = 1000;
jQuery(document).ready(function($) {
    console.log("onDocumentReady()");
	 
	//rollover swap img with rel 	
    var restoreOriginalImage = function(imageElement) {
        console.log("restoreOriginalImage()");
    	
    	// Restore original.
		var original_src = imageElement.attr('original_src');
	    if ( original_src ) {
	    	imageElement.attr('src', original_src);
	    }	    	
    };
    
    var onMouseOut = function() {
        console.log("onMouseOut()");
        restoreOriginalImage($(this));
    };
    
	var onMouseOver = function() {
        console.log("onMouseOver()");
        
		// First time run, save original image source.
		var current_src = $(this).attr('src');
		var original_src = $(this).attr('original_src');
		if ( !original_src ) {
			original_src = current_src;
			$(this).attr('original_src', current_src);
		}
		
		// On rollover, use image linked by rel attribute.
		var current_rel = $(this).attr('rel');
	    if ( current_rel ) {
	    	$(this).attr('src', current_rel);
	    }	
	    
	    // XXX On Android, not always getting onmouseout, so just restore after half a second.
	    var imageElement = $(this);
	    setTimeout(function() {
	    	restoreOriginalImage(imageElement);
	    }, AUTO_MOUSE_OUT_MS);
    };
    
	$(".rollover").hover(onMouseOver, onMouseOut);
	 
	//preload images
	var cache = new Array();
	
	//cycle through all rollover elements and add rollover img src to cache array
	$(".rollover").each(function(){
		var cacheImage = document.createElement('img');
		cacheImage.src = $(this).attr('rel');
		cache.push(cacheImage);
	}); 
	
});