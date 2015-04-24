<?php
    include_once('cnx.php');
    $data = file_get_contents("php://input");
    $objData = json_decode($data);
    $author = $objData -> author_name;
    $pic = $objData -> author_pic;
    $content = $objData -> content;
    $ytVideoID = $objData -> ytVideoID;
    mysql_query("INSERT INTO comments (author_name,author_pic,content,yt_video_id) VALUES ('$author','$pic','$content','$ytVideoID')");
    echo mysql_insert_id();
?>