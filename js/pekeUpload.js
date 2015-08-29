/*
 *  PekeUpload 2.0 - jQuery plugin
 *  written by Pedro Molina
 *  http://www.pekebyte.com/
 *
 *  Copyright (c) 2015 Pedro Molina (http://pekebyte.com)
 *  Dual licensed under the MIT (MIT-LICENSE.txt)
 *  and GPL (GPL-LICENSE.txt) licenses.
 *
 *  Built for jQuery library
 *  http://jquery.com
 *
 */
(function($) {

  $.fn.pekeUpload = function(options){

    // default configuration properties
    var defaults = {
      dragSupport:        false,
      dragText:           'Drag and Drop your files here',
      bootstrap:          false,
      btnText:            'Browse files...',



      onSubmit:           false,
      

      url:                "upload.php",
      theme:              "custom",
      field:              "file",
      data:               null,
      multi:              true,
      showFilename:       true,
      showPercent:        true,
      showErrorAlerts:    true,
      allowedExtensions:  "",
      invalidExtError:    "Invalid File Type",
      maxSize:      0,
      sizeError:      "Size of the file is greather than allowed",
      onFileError:        function(file,error){},
      onFileSuccess:      function(file,data){}
    };

    var options = $.extend(defaults, options);

    var pekeUpload = {
      obj : $(this),
      files : [],
      container: null,
      init : function(){
        this.replacehtml();
        $(document).on('click','.pkuparea',function(){
          pekeUpload.selectfiles();
        });
        ///Handle events when drag
        if (options.dragSupport){
          var dragarea = this.obj.next('div.pkdragarea');
          $(document).on('dragenter', function (e) 
          {
            e.stopPropagation();
            e.preventDefault();
          });
          $(document).on('dragover', function (e) 
          {
            e.stopPropagation();
            e.preventDefault();
          });
          $(document).on('drop', function (e) 
          {
            e.stopPropagation();
            e.preventDefault();
          });
          dragarea.on('dragenter', function (e) 
          {
            e.stopPropagation();
            e.preventDefault();
            $(this).css('border', '2px solid #0B85A1');
          });
          dragarea.on('dragover', function (e) 
          {
            e.stopPropagation();
            e.preventDefault();
          });
          dragarea.on('drop', function (e) 
          {
            $(this).css('border', '2px dotted #0B85A1');
            e.preventDefault();
            var files = e.originalEvent.dataTransfer.files;
            for (var i = 0; i < files.length; i++){
              pekeUpload.files.push(files[i]);
            }
          });
        }
      },
      replacehtml: function(){
        var html = null;
        switch(options.dragSupport){
          case true:
            switch(options.bootstrap){
              case true:
                html = '<div class="well well-lg pkuparea pkdragarea" style="cursor:pointer"><h4>'+options.dragText+'</h4></div>';
              break;
              case false:
                html = '<div class="pekeupload-drag-area pkuparea pkdragarea" syle="cursor:pointer"><h4>'+options.dragText+'</h4></div>';
              break;
            }
          break;
          case false:
            switch(options.bootstrap){
              case true:
                html = '<a href="javascript:void(0)" class="btn btn-primary btn-upload pkuparea"> <i class="glyphicon glyphicon-upload"></i> '+options.btnText+'</a><div class="pekecontainer"></div>';
              break;
              case false:
                html = '<a href="javascript:void(0)" class="pekeupload-btn-file pkuparea">'+options.btnText+'</a><div class="pekecontainer"></div>';
              break;
            }
          break;
        }
        this.obj.after(html);
        this.obj.hide();
        this.container = this.obj.next('div.pekecontainer');
      },
      selectfiles: function(){
        this.obj.click();
      },
      handlefile: function(file){

      }
    };
    
    //Do the magic
    pekeUpload.init();
  };
})(jQuery);