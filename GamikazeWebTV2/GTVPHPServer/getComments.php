<?php
	// Specify domains from which requests are allowed
	header('Access-Control-Allow-Origin: *');
	// Specify which request methods are allowed
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
	// Additional headers which may be sent along with the CORS request
	// The X-Requested-With header allows jQuery requests to go through
	header('Access-Control-Allow-Headers: X-Requested-With');
	
    include_once('cnx.php');
    $data = file_get_contents("php://input");
    $objData = json_decode($data);
    $videoID = $objData -> videoID;
    $lastIdLoaded = $objData -> lastCommentID;
    //$lastIdLoaded += 1;

/*SELECT idcomment
FROM comments
WHERE yt_video_id =  '__1CxZFSfQE'
LIMIT 1*/

    $getLastIDQuery = mysql_query("SELECT idcomment FROM comments WHERE yt_video_id='$videoID' LIMIT 1");
    $num_rows = mysql_num_rows($getLastIDQuery);
    if($getLastIDQuery == $lastIndexLoaded)
    {
    	echo "nope";
    }
    else
    {
	    //echo getData("SELECT * FROM comments WHERE yt_video_id='$videoID' ORDER BY timestamp LIMIT ".$lastIndexLoaded.", 18446744073709551615");
	    /*SELECT * 
FROM comments
WHERE yt_video_id =  '8c2xYwT9_2o'
ORDER BY TIMESTAMP
AND idcomment >55 DESC 
LIMIT 0 , 30*/
	    echo getData("SELECT * FROM comments WHERE yt_video_id='$videoID' AND idcomment > '$lastIdLoaded' ORDER BY TIMESTAMP");
	}
?>