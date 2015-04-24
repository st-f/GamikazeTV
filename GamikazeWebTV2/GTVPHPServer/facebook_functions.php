//1 connect to db via external file V
//2 check db if where=ytid has fbid
//3 if not, post to fb
//4 store returned fb post id
<?php
include_once('php/cnx.php');
include_once('php/funct1ons.php');

function postVideo($target_ytid)
{
    $videoToPost = getData("SELECT * FROM Videos WHERE ytid='$target_ytid' AND fbid='NULL'");
    if($videoToPost)
    {
        makePost();
    }
}

function makePost($source, $message, $published, $)
{
    $msg_body = array(
    'source' => '@'.realpath('myphoto/somephot.gif'),
    'message' => 'message for my wall',
    'published' => 'false', //Keep photo unpublished
    'scheduled_publish_time' => '1333699439' //Or time when post should be published
    );
}


?>