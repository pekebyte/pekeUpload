<?php
/*
PekeUpload
Copyright (c) 2013 Pedro Molina
*/

// Define a destination
$targetFolder = '/uploads'; // Relative to the root

if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFolder . $_FILES['file']['name']))
{
    print "File uploaded";
} 
else
{
    print "Error";
}

?>