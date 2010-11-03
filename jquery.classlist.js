/*!
 * jQuery ClassList Plugin v0.2.1
 * http://github.com/rwldrn/jquery-classlist
 *
 * Copyright (c) 2010 Rick Waldron
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function (jQuery, undefined) {
  
  jQuery.fn.extend({
    
    // Provide a browser compatible implementation of the classList api
    classlist: function () {
      
      var arg, args, ret, apiFn, list, 
          temp = [], 
          elem = this[0], 
          hasClassList = jQuery.support.classList || !!document.createElement("div").classList, 
          fixMethods = {
            "contains" : "has"
          },
          noids = {
            "null": true, 
            "undefined": true,
            "false": true
          };

      //  Getter logic
      if ( !arguments.length ) {
        // Native classList is an array-like object; for normalization 
        // with non-native implementations, we return arrays 
        return ( ( hasClassList && jQuery.makeArray(elem.classList) ) ||
                   ( ( jQuery(elem).attr("class") || "" ).split(" ") ) );

      }

      arguments.length && ( arg  = Array.prototype.join.call(arguments) );
      
      args = arg && arg.match(/(\w+)/gi);
      
      if ( args && args.length >= 2 && !noids[ args[1] ] ) {
        
        // compile a possible jQuery method
        apiFn = ( fixMethods[ args[0] ] ? fixMethods[ args[0] ] : args[0] ) + "Class";

        // Check if we can shortcut to an existing method
        if ( jQuery.fn[ apiFn ] ) {
          
          if ( !hasClassList ) {
            // Uses jQuery addClass, removeClass and toggleClass in single and multi mode 
            // as fallback to native classList methods
            // Returns as documented for these methods
            return jQuery(this)[ apiFn ]( args.slice(1).join(" ") )
          }
          
          //  Use native classList.contains() for performance
          if ( args[0] === 'contains' ) {
            return elem.classList.contains( args[1] );
          } 
          
          //  Use native classlist.add,remove,toggle for performance
          list  = args.slice(1);
          
          this.each(function () {
            for ( var i = 0, len = list.length; i < len; i++ ) {
              this.classList[ args[0] ]( list[i] );
            }
          });

        } else {

          //  Should only resolve to this when item() is called;
          //  Return only for the first matched element
          return hasClassList ? 
                 elem.classList.item(+args[1]) : 
                 jQuery(elem).classlist()[ +args[1] ];
                 // might be faster: elem.className.split(" ")[ +args[1] ]
        }                 
      }
      
      return jQuery(elem).classlist();
    }
  });
})(jQuery);