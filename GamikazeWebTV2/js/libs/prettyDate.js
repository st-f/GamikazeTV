/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
    //--------------------------------------------------------------
    // http://af-design.com/blog/2009/02/10/twitter-like-timestamps/
    //--------------------------------------------------------------
    var system_date = new Date(time);
    var user_date = new Date();
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) return "just now";
    if (diff < 20) return diff + " seconds ago";
    if (diff < 40) return "half a minute ago";
    if (diff < 60) return "less than a minute ago";
    if (diff <= 90) return "one minute ago";
    if (diff <= 3540) return Math.round(diff / 60) + " minutes ago";
    if (diff <= 5400) return "1 hour ago";
    if (diff <= 86400) return Math.round(diff / 3600) + " hours ago";
    if (diff <= 129600) return "1 day ago";
    if (diff < 604800) return Math.round(diff / 86400) + " days ago";
    if (diff <= 777600) return "1 week ago";
    return "on " + time;
}

/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
/*function prettyDate(time){
    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
        diff = (((new Date()).getTime() - date.getTime()) / 1000),
        day_diff = Math.floor(diff / 86400);

    if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
        return;

    return day_diff == 0 && (
        diff < 60 && "just now" ||
            diff < 120 && "1 minute ago" ||
            diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
            diff < 7200 && "1 hour ago" ||
            diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
        day_diff == 1 && "Yesterday" ||
        day_diff < 7 && day_diff + " days ago" ||
        day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
    jQuery.fn.prettyDate = function(){
        return this.each(function(){
            var date = prettyDate(this.title);
            if ( date )
                jQuery(this).text( date );
        });
    };*/