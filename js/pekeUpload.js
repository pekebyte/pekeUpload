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
			theme: 				"bootstrap",
			field: 				"file",
		}; 
		
		var options = $.extend(defaults, options);

		//Main function
		this.each(function() {
			var obj = $(this);
			//HTML code depends of theme
			if (options.theme == "bootstrap"){
			var html = '<a href="javascript:void(0)" class="btn btn-primary btn-upload"> <span class="icon-upload icon-white"></span> '+options.btnText+'</a>';
			var htmlprogress = '<div class="filename"></div><div class="progress progress-striped"><div class="bar pekeup-progress-bar" style="width: 0%;"><span class="badge badge-info"></span></div></div>';
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
				formData.append(options.field, obj[0].files[0]);
				obj.next('a').after(htmlprogress);
				UploadFile(formData);
			});
		});

		function UploadFile(formData){
			$.ajax({
    				url: options.url,
    				type: 'POST',
    				data: formData,
                    dataType: 'json',
    				success: function(data){
    					var percent = 100;
    				},
    				xhr: function() {  // custom xhr
           			 	myXhr = $.ajaxSettings.xhr();
            			if(myXhr.upload){ // check if upload property exists
               		 	myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
			        	}
			        	return myXhr;
        			},
    				cache: false,
                	contentType: false,
                	processData: false
    			});
		}

		function progressHandlingFunction(e){
    		if(e.lengthComputable){
    			var total = e.total;
    			var loaded = e.loaded;
    			var percent = (e.loaded * 100)/e.total;
        		$(this).next('div.pekeup-progress-bar').width(percent+'%');
        		$(this).next('div.pekeup-progress-bar').text(percent+"%");
    		}
		} 
	};

})(jQuery);