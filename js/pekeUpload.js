/*
 * 	PekeUpload 1.0 - jQuery plugin
 *	written by Pedro Molina	
 *	http://www.pekebyte.com/
 *
 *	Copyright (c) 2013 Pedro Molina (http://pekebyte.com)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
 */
(function($) {

	$.fn.pekeUpload = function(options){
	  
		// default configuration properties
		var defaults = {
			onSubmit: 			false,
			btnText: 		    "Browse files...",
			url: 				"",
			theme: 				"bootstrap"
		}; 
		
		var options = $.extend(defaults, options);

		//Main function
		this.each(function() {
			var obj = $(this);
			//HTML code depends of theme
			if (options.theme == "bootstrap"){
			var html = '<a href="javascript:void(0)" class="btn btn-primary btn-upload"> <span class="icon-upload icon-white"></span> '+options.btnText+'</a>';
			var htmlprogress = '<div class="filename"></div><div class="progress progress-striped"><div class="bar" style="width: 0%;"><span class="badge badge-info"></span></div></div>';
			}
			obj.after(html);
			obj.hide();
			//Event when clicked the newly created link
			obj.next('a').click(function(){
				obj.click();
			});
			//Event when user select a file
			obj.change(function(){
				var formData = new FormData();
				formData.append('file', obj[0].files[0]);
				obj.next('a').after(htmlprogress);


			});
		});
	  
	};

})(jQuery);