pekeUpload
==========
###### What is pekeUpload?
is a jQuery plugin that allows you to easily add multiple or single file upload functionality to your website. This plugin uses html5 only.

Some Features include:

1.  Theming (Twitter Bootstrap ready)
2.  Set File size limit
3.  Set File extensions restrictions
4.  Set custom error messages
5.  Real-Time Progress Indicators
6.  And others more...

Do you like this plugin?

[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8MW4KWSLB75YA)

###### Requirements
1.  jQuery 1.4.x or greater
2.  Web browser capable to render HTML5
3.  If you're using Bootstrap, you will need bootstrap.css from v2.2.x or greater
4.  A server capable of parsing PHP, ASP.Net, Cold Fusion, or similar server-side language

###### Implementation

1.  Download pekeUpload zip
2.  Unzip pekeUpload zip
3.  On the page you are implementing pekeUpload on, add a reference to the CSS style<br />
```
 <link href="css/custom.css" rel="stylesheet">   
```
4. Then add a reference to the jQuery library.<br />
```
 <script type="text/javascript" src="js/jquery-1.9.0.min.js"></script>
```
5.  Below the reference to jQuery, add a reference to the pekeUpload script<br />
```
 <script type="text/javascript" src="js/pekeUpload.js"></script>
 ```
6.  On the page, add a file input.<br />
```
 <input id="file" type="file" name="file" />
 ```
7.  Initialize pekeUpload on the file input<br />
```
  $("#file").pekeUpload();
 ```
 
###### Plugin Options

| Option | Default | Format | Description|
| ------ | ------- | ------- | ---------- |
| onSubmit| false | true/false | Gives you the option of upload the files when the file is selected or when you submit the form. When is true, you won't be able to upload multiple files |
| btnText| "Browse files..." | string | Set the text of the upload button |
| url| "upload.php" | string | Set the url of upload script |
| theme | "custom" | "custom"/"bootstrap" | Set the theme for the uploader, "custom" if you want to use your custom css, or "bootstrap" if you prefer the Twitter bootstrap-ready functionality |
| field | "file" | string | Set the name for the POST data field, this is useful for the server-side script |
| data | null | {var1:"value"} | Set POST additional data associated to the file |
| multi | true | true/false | Sets if you want multiple file uploads (true) or a single file upload (false) |
| showFilename | true | true/false | Sets if you want to show the file name on the uploader queue |
| showPercent | true | true/false | Sets if you want to show the percent on the uploader queue |
| showErrorAlerts | true | true/false | Sets if you want to show error alerts on the uploader queue |
| allowedExtensions | "" | "ext1" | Sets the file extensions allowed to upload |
| invalidExtError | "Invalid File Type" | string | Sets the error message when the file has an unsupported extension |
| maxSize | 0 | float | Set the file size limit in MB, 0 means no limit |
| sizeError | "Size of the file is greather than allowed" | string | Sets the error message when the file is bigger than size allowed |
|  onFileError | function(file,error){} | function(file,error){} | Event triggered when some error ocurs, returns error (string), file (object). file returns file.name and file.size |
|  onFileSuccess | function(file,data){} | function(file,data){} | Event triggered when the file has been uploaded succesfully, returns data (string), file (object). file returns file.name and file.size |

###### Sever side script considerations
The server side script must return '1' when file meets all the server-validations, otherwise print another message and will be showed as an error on the file queue. See (upload.php)

	


