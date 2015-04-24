<?php
   //args: URL, playlistID
   //if live 
   //{
   //	> get playlist > get selected video id
   //} else {
   //	> get video id from URL
   //}
   //get video id metadata: title, description.
   //echo metadata
   
//$url = 'cT8YkYlP2H4';

$playlistID = 'PLVEH4RPM7Hla9IFDfE-WAt0KK01jDjvCF';
$playlistURL = 'http://gdata.youtube.com/feeds/api/playlists/PLxpWFvKvVIYVt16p7GeVzZ5P2xMkiemAU';
//REQUIRES ZEND and Zend_Gdata_YouTube MODULE. RUN installationChecker.php first.
require_once 'Zend/Loader.php'; // the Zend dir must be in your include_path
Zend_Loader::loadClass('Zend_Gdata_YouTube');

$yt = new Zend_Gdata_YouTube();
$url = 'http://gdata.youtube.com/feeds/api/playlists/'.$playlistID.'?v=2';
//$playlistVideoFeed = $yt->getPlaylistVideoFeed($url);
//$playlistVideoFeed = $yt->retrieveAllEntriesForFeed($yt->getPlaylistVideoFeed($url));
//print_r($playlistVideoFeed);
//foreach ($playlistVideoFeed as $playlistEntry) {
	//var_dump($playlistEntry);
	echo "<pre>";
	//var_dump($playlistEntry->mediaGroup);
	//return;
    //echo $playlistEntry->title->text . "<br>";
    //echo $playlistEntry->id->text . "<br>";
    //echo $playlistEntry->getVideoDescription();
	//echo $playlistEntry->getVideoID();
    
    $videoEntry = $yt->getVideoEntry('wst4zG_BNUg');
	$videoThumbnails = $videoEntry->getVideoThumbnails()[0].url;
	print_r($videoThumbnails);
	echo "</pre>";
//}
?>