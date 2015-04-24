<!doctype html>
<html ng-app="app" xmlns="http://www.w3.org/1999/html">
<head>
    <title>Gamikaze.TV - The Real Gaming TV, 24/7. Updated daily.</title>
    <meta name="fragment" content="!" />
    <meta content="width=device-width,minimum-scale=1,maximum-scale=1" name="viewport">
    <meta http-equiv="Access-Control-Allow-Origin" content="*">
    <?php
    // TODO: ADD MORE CRAWLERS HERE
    if (in_array($_SERVER['HTTP_USER_AGENT'], array(
      'facebookexternalhit/1.1 (+https://www.facebook.com/externalhit_uatext.php)',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)')))
    {
        //NEEDS REWRITE RULE IN .HTACCESS
        //echo "URL: " . $_SERVER['REQUEST_URI'];
        /*$playlistID = 'PLVEH4RPM7Hla9IFDfE-WAt0KK01jDjvCF';
        $playlistURL = 'http://gdata.youtube.com/feeds/api/playlists/PLxpWFvKvVIYVt16p7GeVzZ5P2xMkiemAU';*/
        if (strpos($_SERVER['REQUEST_URI'],'videos%3A') !== false)
        {
            $URI_Array = explode('videos', $_SERVER['REQUEST_URI']);
            $videoID = substr($URI_Array[1],3);
            //REQUIRES ZEND and Zend_Gdata_YouTube MODULE. RUN installationChecker.php first.
            require_once 'Zend/Loader.php'; // the Zend dir must be in your include_path
            Zend_Loader::loadClass('Zend_Gdata_YouTube');
            $yt = new Zend_Gdata_YouTube();
            $videoEntry = $yt->getVideoEntry($videoID);
            $videoThumbnails = $videoEntry->getVideoThumbnails();
            $videoThumbnail = $videoThumbnails[0]['url'];
            $videoDescription = $videoEntry->getVideoDescription();
            $videoTitle = $videoEntry->title->text;
    ?>
        <meta property="fb:app_id" content="514569015253582">
        <?php echo "<meta property=\"og:description\" content=\"" . $videoDescription . "\">"; ?>
        <meta property="og:type" content="video">
        <meta property="og:video:type" content="application/x-shockwave-flash">
        <meta property="og:video:width" content="460">
        <meta property="og:video:height" content="285">
        <?php echo "<meta property=\"og:title\" content=\"" . $videoTitle . " on Gamikaze.TV\">"; ?>
        <?php echo "<meta property=\"og:url\" content=\"http://gamikaze.tv/#!/videos:" . $videoID . "\">"; ?>
        <?php echo "<meta property=\"og:video\" content=\"http://www.youtube.com/v/" . $videoID . "?autohide=1&amp;version=3\">"; ?>
        <?php echo "<meta property=\"og:image\" content=\"" . $videoThumbnail . "\">"; ?>
        <meta property="og:site_name" content="Gamikaze.TV">
    <?php
        }
    }
    ?>
    <script type="text/javascript" src="http://code.angularjs.org/angular-1.0.0rc10.min.js"></script>
    <script src="http://code.jquery.com/jquery.min.js" type="text/javascript"></script>
    <script src="js/libs/scrollTo.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.2.1/js/bootstrap.js"></script>
    <script src="//js.leapmotion.com/0.2.0-beta1/leap.min.js"></script>
    <script type="text/javascript" src="js/libs/YoutubeFunctions.js"></script>
    <script type="text/javascript" src="js/libs/prettyDate.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="js/controllers.js"></script>
    <script type="text/javascript" src="js/youtube.js"></script>
    <script type="text/javascript" src="js/facebook.js"></script>
    <script type="text/javascript" src="js/libs/ga.js"></script>
    <!-- start Mixpanel -->
    <script type="text/javascript">(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===e.location.protocol?"https:":"http:")+'//cdn.mxpnl.com/libs/mixpanel-2.2.min.js';f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f);b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==
            typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");for(g=0;g<i.length;g++)f(c,i[g]);
        b._i.push([a,e,d])};b.__SV=1.2}})(document,window.mixpanel||[]);
    mixpanel.init("98e09616b63fb60c236ac57af066cbe5");</script>
    <!-- end Mixpanel -->
    <link rel="stylesheet" href="http://twitter.github.io/bootstrap/assets/css/bootstrap.css">
    <link href='http://fonts.googleapis.com/css?family=Alef' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="http://netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.css">
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <link rel="stylesheet" href="css/topbar.css">
    <link rel="stylesheet" href="css/bottombar.css">
    <link rel="stylesheet" href="css/SidebarPlaylist.css">
    <link rel="stylesheet" href="css/SidebarShare.css">
</head>
<body data-status="{{ status }}">
<div id="fb-root"></div>
<div class="viewport" ng-controller="MainCtrl">
    <div class="frame" ng-controller="YoutubeCtrl">
        <div id="menu0" class="first span0">
            <ul class="nav nav-tabs nav-stacked btn-group btn-group-vertical nav-icons-left"
                data-toggle="buttons-radio">
                <button id="liveBtn" type="button" class="btn btnLeftSidebar"
                        ng-class="{active: currentview=='live' || currentview ==''}"
                        ng-click="setRoute('/live')">
                    <i class="icon-play icon-2x"></i><br/>LIVE & CHAT
                </button>
                <button type="button" class="btn btnLeftSidebar"
                        ng-class="{active: currentview=='comment'}"
                        ng-click="setRoute('/comment')">
                    <i class="icon-comment icon-2x"></i><br/>COMMENT
                </button>
                <button type="button" class="btn btnLeftSidebar"
                        ng-class="{active: currentview=='videos'}"
                        ng-click="setRoute('/videos')">
                    <i class="icon-film icon-2x"></i><br/>VIDEOS
                </button>
                <button type="button" class="btn btnLeftSidebar"
                         ng-class="{active: currentview=='search'}"
                         ng-click="setRoute('/search')">
                <i class="icon-search icon-2x"></i><br/>SEARCH
                </button>
                <button type="button" class="btn btnLeftSidebar"
                         ng-class="{active: currentview=='share'}"
                         ng-click="setRoute('/share')">
                <i class="icon-share icon-2x"></i><br/>SHARE
                </button>
            </ul>
        </div>
        <div id="menu" class="menu nav-collapse width collapse">
            <div class="collapse-inner">
                <div id="container">
                    <div ng-view id="containerNgView"></div>
                </div>
            </div>
        </div>
        <div class="view">
            <div class="navbar navbar-inverse">
                <div id="topnav" class="navbar-inner">
                    <div class="row-fluid">
                        <div class="logoDiv topBarContainerFloatLeft">
                            <a href="http://www.facebook.com/Gamikaze.TV" target="_blank"></a>
                        </div>
                        <div class="fb-like topBarContainerFloatLeft" data-href="http://www.facebook.com/Gamikaze.TV" data-send="false" data-layout="button_count" data-width="110" data-show-faces="false"></div
                                <!-- Yeah right. Thanks, Amazon API! -->
                                <!--<div class="amazonBuyButton">
                                <div class="amazonBuyButton">
                                    <SCRIPT charset="utf-8" type="text/javascript" src="http://ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&MarketPlace=US&ID=V20070822%2FUS%2Fgamikaze-20%2F8005%2F188679a9-ed32-4fe5-97f9-acf74f9d2f52"> </SCRIPT> <NOSCRIPT><A HREF="http://ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&MarketPlace=US&ID=V20070822%2FUS%2Fgamikaze-20%2F8005%2F188679a9-ed32-4fe5-97f9-acf74f9d2f52&Operation=NoScript">Amazon.com Widgets</A></NOSCRIPT>
                                    <a type="amzn" search="{{currentVideo.media$group.media$description.$t}}" category="video games">
                                        <img src="img/buy-now-1.gif">
                                    </a>
                                </div>-->
                        <a href="http://st-f.net/websites/gamikazewebtv/" target="_self" style="color:white; padding-left:15px; text-decoration:none;">Flash Version</a>
                        <div class="amazonBuyButton">
                            <a href="http://www.amazon.com/s/?url=search-alias=aps&amp;field-keywords={{currentVideo.title.$t}}&amp;tag=gamikaze-20&amp;link_code=wql&amp;_encoding=UTF-8" target="_blank">
                                <img src="img/buy-now-1.gif">
                            </a>
                        </div>
                                <!--<div class="topBarContainerFloatLeft">
                                    <button type="button" ng-click="playNextVideo()" class="btn btnLeftSidebar">
                                        <i class="icon-play icon-2x">NEXT VIDEO</i>
                                    </button>
                                </div>
                                <div class="topBarContainerFloatLeft">
                                    <button type="button" ng-click="playNextVideo()" class="btn btnLeftSidebar">
                                        <i class="icon-play icon-2x">BACK TO LIVE</i>
                                    </button>
                                </div>-->
                    </div>
                </div>
            </div>
            <div id="content" class="mainVideoDiv" ng-switch on="playlistLoaded">
                <div id="player"></div>
                <!--<div ng-switch-when="true">-->
                    <div id="bottombarHelper" ng-switch on="showBottomBar">
                        <div ng-switch-when="nowplaying" ng-include="'views/bottombar/BottombarNowPlaying.html'"></div>
                        <div ng-switch-when="comingnext" ng-include="'views/bottombar/BottombarComingNext.html'"></div>
                        <div ng-switch-when="chatmessage" ng-include="'views/bottombar/BottombarChatMessage.html'"></div>
                        <div ng-switch-when="loading" ng-include="'views/bottombar/BottombarLoading.html'"></div>
                    </div>
                <!--</div>-->
            </div>
        </div>
    </div>
</div>
</body>
</html>