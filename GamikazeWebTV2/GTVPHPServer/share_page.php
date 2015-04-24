<?php
$id_inscription = $_GET['id'];
$video_url = $_GET['video_url'];
$video_preview_image = 'http://gamikaze.tv/logo90.jpg';
?>
<!DOCTYPE html>
<html>
<head>
<title>GamikazeWebTV</title>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<meta http-equiv="content-language" content="en">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

<!-- Open graph tags for Facebook -->
<meta property="og:video" content="<?php echo $video_url; ?>"/>
<meta property="og:title" content="Test video player" />
<meta property="og:description" content="A video player interface experiment." />
<meta property="og:type" content="video" />
<meta property="og:url" content="http://www.gamikaze.tv/GamikazeWebTV.swf?<?php echo $video_url; ?>"/>
<meta property="og:image" content="<?php echo $video_preview_image; ?>"/>
<meta property="og:site_name" content="Gamikaze.TV"/>

<!-- Video specific open graph tags -->
<meta property="og:video" content="http://www.gamikaze.tv/GamikazeWebTV.swf?<?php echo $video_url; ?>" />
<meta property="og:video:secure_url" content="http://www.gamikaze.tv/GamikazeWebTV.swf?<?php echo $video_url; ?>" /> <!-- Required for people on Facebook who have secure browsing enabled! -->
<meta property="og:video:width" content="325" />
<meta property="og:video:height" content="180" />
<meta property="og:video:type" content="application/x-shockwave-flash" />

<script src="js/swfobject.js"></script>
<script>
    var flashvars = {
        //xmlUrl:"xml/data-<?php echo $id_inscription; ?>.xml",
        //policyFileUrl:"http://profile.ak.fbcdn.net/crossdomain.xml"
        //video_url:"<?php echo $video_url ?>"
    };
    var params = {
        menu: "false",
        scale: "noScale",
        allowFullscreen: "true",
        allowScriptAccess: "always",
        bgcolor: "",
        wmode: "opaque"
        //wmode: "direct" // can cause issues with FP settings & webcam
    };
    var attributes = {
        id:"content"
    };
    swfobject.embedSWF(
        "app.swf",
        "altContent", "480", "270", "10.0.0",
        "expressInstall.swf",
        flashvars, params, attributes);
</script>
</head>

<body>
<div id="altContent">
    <p><a href="http://www.adobe.com/go/getflashplayer">Get Adobe Flash player</a></p>
</div>
</body>

</html>