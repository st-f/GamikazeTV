<?php
include_once('cnxGcom.php');
$id=2813;
//$id=1929;
//header('Content-Type: text/html; charset=utf8');
$result = mysql_query("SELECT test FROM tests WHERE idjeux_videos='$id'");
while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
   //$text = substr($row[0], 0, 800);
   $text = $row[0];
   //echo $text;
   echo "<br><br>===================================[ STR_REPLACE ]===================================<br><br>";
   $text = str_replace("'??","'",$text);
   //$text = str_replace("é","ÃƒÂ©",$text);
   //$text = str_replace("à","ÃƒÂ",$text);
   //$text = str_replace("î","ÃƒÂ®",$text);
   //echo $text;
   //echo "<br><br>===================================[ UTF8_DECODE ]===================================<br><br>";
   //echo utf8_decode($text);
   /*echo "<br><br><br>===================================[ UTF8_DECODE ][ UTF8_DECODE ]===================================<br><br>";
   echo utf8_decode(utf8_decode($text));
   echo "<br><br><br>===================================[ UTF8_ENCODE ][ UTF8_DECODE ]===================================<br><br>";
   echo utf8_encode(utf8_decode($text));
   echo "<br><br><br>===================================[ UTF8_DECODE ][ UTF8_ENCODE ]===================================<br><br>";
   echo utf8_decode(utf8_encode($text));
   echo "<br><br><br>===================================[ UTF8_ENCODE ]===================================<br><br>";
   echo utf8_encode($text);
   echo "<br><br><br>===================================[ UTF8_ENCODE ][ UTF8_ENCODE ]===================================<br><br>";
   echo utf8_encode(utf8_encode($text));*/
}
$text = addslashes(utf8_decode($text));
echo "<br><br>===================================[ UPDATE ]===================================<br><br>";
$resultUpdate = mysql_query("UPDATE tests SET test='$text' WHERE idjeux_videos='$id'") or die(mysql_error());
echo $resultUpdate;
?>