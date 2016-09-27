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
    $.fn.pekeUpload = function(options) {
        // default configuration properties
        var defaults = {
            dragMode: false,
            dragText: "Drag and Drop your files here",
            bootstrap: false,
            btnText: "Browse files...",
            allowedExtensions: "",
            invalidExtError: "Invalid File Type",
            maxSize: 0,
            sizeError: "Size of the file is greather than allowed",
            showPreview: true,
            showFilename: true,
            showPercent: true,
            showErrorAlerts: true,
            errorOnResponse: "There has been an error uploading your file",
            onSubmit: false,
            url: "upload.php",
            data: null,
            limit: 0,
            limitError: "You have reached the limit of files that you can upload",
            delfiletext: "Remove from queue",
            onFileError: function(file, error) {},
            onFileSuccess: function(file, data) {}
        };
        var options = $.extend(defaults, options);
        var pekeUpload = {
            obj: $(this),
            files: [],
            uparea: null,
            container: null,
            uploadedfiles: 0,
            hasErrors: false,
            init: function() {
                this.replacehtml();
                this.uparea.on("click", function() {
                    pekeUpload.selectfiles();
                });
                ///Handle events when drag
                if (options.dragMode) {
                    this.handledragevents();
                }
                this.handlebuttonevents();
                //Dismiss all warnings
                $(document).on("click", ".pkwrncl", function() {
                    $(this).parent("div").remove();
                });
                //Bind event if is on Submit
                if (options.onSubmit) {
                    this.handleFormSubmission();
                }
            },
            replacehtml: function() {
                var html = null;
                switch (options.dragMode) {
                  case true:
                    switch (options.bootstrap) {
                      case true:
                        html = '<div class="well well-lg pkuparea pkdragarea" style="cursor:pointer"><h4>' + options.dragText + "</h4></div>";
                        break;

                      case false:
                        html = '<div class="pekeupload-drag-area pkuparea pkdragarea" style="cursor:pointer"><h4>' + options.dragText + "</h4></div>";
                        break;
                    }
                    break;

                  case false:
                    switch (options.bootstrap) {
                      case true:
                        html = '<a href="javascript:void(0)" class="btn btn-primary btn-upload pkuparea"> <i class="glyphicon glyphicon-upload"></i> ' + options.btnText + "</a>";
                        break;

                      case false:
                        html = '<a href="javascript:void(0)" class="pekeupload-btn-file pkuparea">' + options.btnText + "</a>";
                        break;
                    }
                    break;
                }
                this.obj.hide();
                this.uparea = $(html).insertAfter(this.obj);
                this.container = $('<div class="pekecontainer"><ul></ul></div>').insertAfter(this.uparea);
            },
            selectfiles: function() {
                this.obj.click();
            },
            handlebuttonevents: function() {
                $(document).on("change", this.obj.selector, function() {
                    pekeUpload.checkFile(pekeUpload.obj[0].files[0]);
                });
                $(document).on('click','.pkdel',function(){
                    var parent = $(this).parent('div').parent('div');
                    pekeUpload.delAndRearrange(parent);
                });
            },
            handledragevents: function() {
                $(document).on("dragenter", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).on("drop", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.uparea.on("dragenter", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    $(this).css("border", "2px solid #0B85A1");
                });
                this.uparea.on("dragover", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
                this.uparea.on("drop", function(e) {
                    $(this).css("border", "2px dotted #0B85A1");
                    e.preventDefault();
                    var files = e.originalEvent.dataTransfer.files;
                    for (var i = 0; i < files.length; i++) {
                        pekeUpload.checkFile(files[i]);
                    }
                });
            },
            checkFile: function(file) {
                error = this.validateFile(file);
                if (error) {
                    if (options.showErrorAlerts) {
                        this.addWarning(error);
                    }
                    this.hasErrors = true;
                    options.onFileError(file, error);
                } else {
                    this.files.push(file);
                    if (this.files.length > options.limit && options.limit > 0) {
                        this.files.splice(this.files.length - 1, 1);
                        if (options.showErrorAlerts) {
                            this.addWarning(options.limitError, this.obj);
                        }
                        this.hasErrors = true;
                        options.onFileError(file, error);
                    } else {
                        this.addRow(file);
                        if (options.onSubmit == false) {
                            this.upload(file, this.files.length - 1);
                        }
                    }
                }
            },
            addWarning: function(error, c) {
                var html = null;
                switch (options.bootstrap) {
                  case true:
                    html = '<div class="alert alert-danger"><button type="button" class="close pkwrncl" data-dismiss="alert">&times;</button> ' + error + "</div>";
                    break;

                  case false:
                    html = '<div class="alert-pekeupload"><button type="button" class="close pkwrncl" data-dismiss="alert">&times;</button> ' + error + "</div>";
                    break;
                }
                if (!c) {
                    this.container.append(html);
                } else {
                    $(html).insertBefore(c);
                }
            },
            validateFile: function(file) {
                if (!this.checkExtension(file)) {
                    return options.invalidExtError;
                }
                if (!this.checkSize(file)) {
                    return options.sizeError;
                }
                return null;
            },
            checkExtension: function(file) {
                if (options.allowedExtensions == "") {
                    return true;
                }
                var ext = file.name.split(".").pop().toLowerCase();
                var allowed = options.allowedExtensions.split("|");
                if ($.inArray(ext, allowed) == -1) {
                    return false;
                } else {
                    return true;
                }
            },
            checkSize: function(file) {
                if (options.maxSize == 0) {
                    return true;
                }
                if (file.size > options.maxSize) {
                    return false;
                } else {
                    return true;
                }
            },
            addRow: function(file) {
                var i = this.files.length - 1;
                switch (options.bootstrap) {
                  case true:
                    var newRow = $('<div class="row pkrw" rel="' + i + '"></div>').appendTo(this.container);
                    if (options.showPreview) {
                        var prev = $('<div class="col-lg-2 col-md-2 col-xs-4"></div>').appendTo(newRow);
                        this.previewFile(prev, file);
                    }
                    var finfo = $('<div class="col-lg-8 col-md-8 col-xs-8"></div>').appendTo(newRow);
                    if (options.showFilename) {
                        finfo.append('<div class="filename">' + file.name + "</div>");
                    }
                    if (options.notAjax == false){
                        var progress = $('<div class="progress"><div class="pkuppbr progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;"></div></div>').appendTo(finfo);
                        if (options.showPercent) {
                            progress.find("div.progress-bar").text("0%");
                        }
                    }
                    var dismiss = $('<div class="col-lg-2 col-md-2 col-xs-2"></div>').appendTo(newRow);
                    $('<a href="javascript:void(0);" class="btn btn-danger pkdel">'+options.delfiletext+'</a>').appendTo(dismiss);
                    break;

                  case false:
                    var newRow = $('<div class="pekerow pkrw" rel="' + i + '"></div>').appendTo(this.container);
                    if (options.showPreview) {
                        var prev = $('<div class="pekeitem_preview"></div>').appendTo(newRow);
                        this.previewFile(prev, file);
                    }
                    var finfo = $('<div class="file"></div>').appendTo(newRow);
                    if (options.showFilename) {
                        finfo.append('<div class="filename">' + file.name + "</div>");
                    }
                    if (options.notAjax == false){
                        var progress = $('<div class="progress-pekeupload"><div class="pkuppbr bar-pekeupload pekeup-progress-bar" style="min-width: 2em;width:0%"><span></span></div></div>').appendTo(finfo);
                        if (options.showPercent) {
                            progress.find("div.bar-pekeupload").text("0%");
                        }
                    }
                    var dismiss = $('<div class="pkdelfile"></div>').appendTo(newRow);
                    $('<a href="javascript:void(0);" class="delbutton pkdel">'+options.delfiletext+'</a>').appendTo(dismiss);
                    break;
                }
            },
            previewFile: function(container, file) {
                var type = file.type.split("/")[0];
                switch (type) {
                  case "image":
                    var fileUrl = window.URL.createObjectURL(file);
                    var prev = $('<img class="thumbnail" src="' + fileUrl + '" height="64" />').appendTo(container);
                    break;

                  case "video":
                    var fileUrl = window.URL.createObjectURL(file);
                    var prev = $('<video src="' + fileUrl + '" width="100%" controls></video>').appendTo(container);
                    break;

                  case "audio":
                    var fileUrl = window.URL.createObjectURL(file);
                    var prev = $('<audio src="' + fileUrl + '" width="100%" controls></audio>').appendTo(container);
                    break;

                  default:
                    if (options.bootstrap) {
                        var prev = $('<i class="glyphicon glyphicon-file"></i>').appendTo(container);
                    } else {
                        var prev = $('<div class="pekeupload-item-file"></div>').appendTo(container);
                    }
                    break;
                }
            },
            upload: function(file, pos) {
                var formData = new FormData();
                formData.append(this.obj.attr("name"), file);
                for (var key in options.data) {
                    formData.append(key, options.data[key]);
                }
                $.ajax({
                    url: options.url,
                    type: "POST",
                    data: formData,
                    dataType: "json",
                    success: function(data) {
                        if (data == 1 || data.success == 1) {
                            pekeUpload.files[pos] = null;
                            $('div.row[rel="' + pos + '"]').find(".pkuppbr").css("width", "100%");
                            options.onFileSuccess(file, data);
                        } else {
                            pekeUpload.files.splice(pos, 1);
                            var err = null;
                            if (error in data) {
                                err = null;
                            } else {
                                err = options.errorOnResponse;
                            }
                            if (options.showErrorAlerts) {
                                pekeUpload.addWarning(err, $('div.row[rel="' + pos + '"]'));
                            }
                            $('div.row[rel="' + pos + '"]').remove();
                            pekeUpload.hasErrors = true;
                            options.onFileError(file, err);
                        }
                    },
                    error: function(xhr, ajaxOptions, thrownError) {
                        pekeUpload.files.splice(pos, 1);
                        if (options.showErrorAlerts) {
                            pekeUpload.addWarning(thrownError, $('div.pkrw[rel="' + pos + '"]'));
                        }
                        pekeUpload.hasErrors = true;
                        options.onFileError(file, thrownError);
                        $('div.pkrw[rel="' + pos + '"]').remove();
                    },
                    xhr: function() {
                        myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload) {
                            myXhr.upload.addEventListener("progress", function(e) {
                                pekeUpload.handleProgress(e, pos);
                            }, false);
                        }
                        return myXhr;
                    },
                    complete: function() {
                        if (options.onSubmit) {
                            pekeUpload.uploadedfiles++;
                            if (pekeUpload.uploadedfiles == pekeUpload.files.length && pekeUpload.hasErrors == false) {
                                pekeUpload.obj.remove();
                                pekeUpload.obj.parent("form").submit();
                            }
                        }
                    },
                    cache: false,
                    contentType: false,
                    processData: false
                });
            },
            handleProgress: function(e, pos) {
                if (e.lengthComputable) {
                    var total = e.total;
                    var loaded = e.loaded;
                    var percent = Number((e.loaded * 100 / e.total).toFixed(2));
                    var progressbar = $('div.pkrw[rel="' + pos + '"]').find(".pkuppbr");
                    progressbar.css("width", percent + "%");
                    if (options.showPercent) {
                        progressbar.text(percent + "%");
                    }
                }
            },
            handleFormSubmission: function() {
                var form = this.obj.parent("form");
                form.submit(function() {
                    pekeUpload.hasErrors = false;
                    pekeUpload.uploadedfiles = 0;
                    for (var i = 0; i < pekeUpload.files.length; i++) {
                        if (pekeUpload.files[i]) {
                            pekeUpload.upload(pekeUpload.files[i], i);
                        } else {
                            pekeUpload.uploadedfiles++;
                            if (pekeUpload.uploadedfiles == pekeUpload.files.length && pekeUpload.hasErrors == false) {
                                pekeUpload.obj.remove();
                                return true;
                            }
                        }
                    }
                    return false;
                });
            },
            delAndRearrange: function(parent){
                var id = parent.attr('rel');
                pekeUpload.files.splice(parseInt(id), 1);
                parent.remove();
                pekeUpload.container.find('div.pkrw').each(function(index){
                    $(this).attr('rel',index);
                });
            }
        };
        pekeUpload.init();
    };
})(jQuery);