'use strict';

angular.module('gamikaze.youtube', []);

function YoutubeCtrl($scope, $http, $window) {
    $scope.youtubeResult = [];
    $scope.playlistTotalResults = 0;
    $scope.startIndex = 1;
    $scope.playlistLoaded = false;
    $scope.playlistID = "PLVEH4RPM7Hla0Y1cCa2lJuKLlHQaFUS6I";
    $scope.devKey = "AIzaSyCHprHGVj84zeUpDcSFzEfMECH6bEVu3d4";
    $scope.isSearchingYoutube = false;
    $scope.videoSearchResults = [];
    $scope.searchTerm = "";

    $scope.$on('$viewContentLoaded', function () {
        window.onYouTubeIframeAPIReady = function () {
            resizeWin();
            $scope.loadPlaylist();
        };
    });

    $scope.showNotificationBar = function (bar, duration) {
        duration = duration || 5000;
        $scope.showBottomBar = bar;
        $(bottombarHelper).stop();
        $(bottombarHelper).clearQueue();
        console.warn("showNotificationBar    : " + bar + " for " + duration + "ms");
        if (bar == "chatmessage") {
            //1s per 10 chars
            var _duration = 1000 + $scope.currentChatMessage.content.length * 90;
            console.log("showChatMessage, duration: " + _duration);
            $(bottombarHelper).fadeIn(200).delay(_duration).fadeOut(200);
        }
        else if (bar == "nowplaying") {
            console.warn("showNotificationBar: currentVideo.title.$t: ");
            console.warn($scope.currentVideo);
            $(bottombarHelper).fadeIn(500).delay(duration).fadeOut(500);
        }
        else if (bar == "comingnext") {
            $(bottombarHelper).fadeIn(500);
        }
        $scope.$digest();
        resizeWin();
    }

    $scope.hideNotificationBar = function () {
        console.warn("hideNotificationBar");
        $(bottombarHelper).fadeOut(500);
    }

    $scope.getRemaingVideoTime = function () {
        if (!$scope.currentVideo) {
            return 100;
        }
        console.log("getRemainingTime");
        console.log($scope.currentVideo);
        return parseInt($scope.currentVideo.media$group.yt$duration.seconds - $scope.player.getCurrentTime());
    }

    $scope.bottombarLock = 1;

    $scope.onPlayerReady = function (event) {
        console.warn("PLAYER READY");
        //LEAP
        var leapController = new Leap.Controller({enableGestures: true});
        leapController.loop(function (obj) {
            if (obj.hands.length < 1) return;
            if (obj.gestures.length < 1) return;
            //var x = obj.hands[0].palmNormal[0];
            //var z = obj.hands[0].palmNormal[2];
            //console.log(obj.gestures[0].type);
            if (obj.gestures[0].type == "swipe") {
                //console.log(obj.gestures[0].duration);
                if (obj.gestures[0].duration == 0) $scope.playNextVideo();
            }
        });
        setInterval(function () {
            //console.warn($scope.player.getCurrentTime()+" LOCK: "+$scope.bottombarLock);
            if ($scope.player.getCurrentTime() > 0) {
                //executes once
                if ($scope.bottombarLock == 0) {
                    if ($scope.getRemaingVideoTime() < 20) {
                        $scope.showNotificationBar("comingnext");
                        $scope.bottombarLock = 1;
                    }
                }
                if ($scope.getRemaingVideoTime() < 20) {
                    $scope.remainingTime = $scope.getRemaingVideoTime();
                    $scope.$digest();
                }
            }
        }, 1000);
    };

    $scope.onPlayerStateChange = function (event) {
        //Possible values are unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
        switch (event.data) {
            /*case -1:
             $scope.currentVideo = getVideoInPlaylist($scope.youtubeResult, $scope.player.getVideoData().video_id);
             $scope.nextVideo = getNextVideoInPlaylist($scope.youtubeResult, $scope.player.getVideoData().video_id);
             console.warn("LOADING NEXT VIDEO IN PLAYLIST: "+$scope.player.getVideoData().video_id);
             $scope.showNotificationBar("nowplaying");
             if (navigator.userAgent.match(/iPad/i) != null) {
             $scope.currentVideo = $scope.nextVideo;
             $scope.loadVideo($scope.currentVideo);
             }
             break;*/
            case 0:
                console.warn("onPlayerStateChange: ended");
                $scope.playNextVideo();
                break;
            case 1:
                console.log("playing: " + $scope.videoFromURL);
                if ($scope.videoFromURL == false) {
                    $scope.currentVideo = getVideoInPlaylist($scope.youtubeResult, $scope.player.getVideoData().video_id);
                    $scope.nextVideo = getNextVideoInPlaylist($scope.youtubeResult, $scope.player.getVideoData().video_id);
                }
                //console.log("onPlayerStateChange: playing: $scope.justStarted: " + $scope.justStarted);
                //console.log("onPlayerStateChange: playing: $scope.player.getVideoData().video_id: " + $scope.player.getVideoData().video_id);
                console.warn("PLAYING: " + $scope.player.getCurrentTime() + " remaining time: " + $scope.getRemaingVideoTime());
                if ($scope.getRemaingVideoTime() < 20) {
                    $scope.showNotificationBar("comingnext");
                }
                else {
                    $scope.showNotificationBar("nowplaying");
                    $scope.bottombarLock = 0;
                }
                resizeWin();
                break;
            case 2:
                console.log("onPlayerStateChange: paused: $scope.justStarted: " + $scope.justStarted);
                $scope.bottombarLock = 1;
                $(bottombarHelper).fadeIn(500);
                break;
            case 3:
                console.log("onPlayerStateChange: buffering");
                $scope.showNotificationBar("loading");
                break;
            case 5:
                console.log("onPlayerStateChange: video cued");
                break;
        }
    };

    $scope.playNextVideo = function () {
        $scope.currentVideo = getNextVideoInPlaylist($scope.youtubeResult, $scope.player.getVideoData().video_id);
        $scope.loadVideo($scope.currentVideo);
    }

    $scope.createPlayer = function () {
        if (!$scope.currentVideoID) {
            return;
        }
        console.warn("CREATING PLAYER: startPosition: " + $scope.videoStartPosition + " currentVideoID: " + $scope.currentVideoID);
        //console.log("CREATE PLAYER: " + $scope.videoFromURL);
        var playerparams = {
            origin: 'http://gamikaze.tv',	// should be your domain
            //origin: 'http://localhost:8888',	// should be your domain
            controls: '1',
            vq: 'hd720',
            fs: '1',
            wmode: 'transparent', //opaque is mandatory for chrome mac (z-index issues) BUT doesnt work on the ipad.
            allowfullscreen: 'true',
            //allowscriptaccess: 'always', //is set by default...
            autohide: '1', //is set by default...
            autoplay: '0',
            showinfo: '0',						// don't show the title of the video upon hover etc.
            modestbranding: '1', 				// minimal branding
            rel: '0',							// don't show related videos when the video ends
            theme: 'dark',						// light or dark theme
            iv_load_policy: '3',				// don't show video annotations by default
            enablejsapi: '1'
        };
        if (navigator.userAgent.match(/iPad/i) == null) {
            playerparams.wmode = 'opaque';
            playerparams.autoplay = '1';
        }
        if ($scope.videoFromURL == false && navigator.userAgent.match(/iPad/i) == null) {
            //playerparams.listType = 'playlist';
            //playerparams.list = $scope.playlistID;
        }
        playerparams.start = $scope.videoStartPosition;
        // ! showinfo screws fade in and out of the bottom bar!!
        $scope.player = new YT.Player('player', {
            videoId: $scope.currentVideoID,
            playerVars: playerparams,
            events: {
                'onReady': $scope.onPlayerReady,
                'onStateChange': $scope.onPlayerStateChange
            }
        });
    };

    $scope.stopVideo = function () {
        $scope.player.pauseVideo();
    };

    $scope.getSelectedVideo = function (videoId) {
        if (videoId == $scope.currentVideoID) {
            return "videoItemActive"
        } else {
            return ""
        }
    };

    //MESSAGING
    $scope.conn.onmessage = function (event) {
        $scope.currentChatMessage = JSON.parse(event.data);
        $scope.currentChatMessage.timestamp = prettyDate(new Date());
        //console.warn($scope.$commentsData);
        if ($scope.currentview == 'live') {
            $scope.commentsData.unshift($scope.currentChatMessage);
        }
        $scope.$digest();
        //console.warn($scope.$commentsData);
        $scope.showNotificationBar("chatmessage");
    }

    $scope.loadPlaylist = function () {
        //var url = "http://gdata.youtube.com/feeds/api/playlists/" + $scope.playlistID + "?v=2&max-results=50&start-index=" + $scope.startIndex + "&alt=json-in-script&callback=JSON_CALLBACK&key=" + $scope.devKey;
        var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + $scope.playlistID + "&key=" + $scope.devKey + "&callback=JSON_CALLBACK";
        console.log("loadPlaylist ID: " + $scope.playlistID);
        console.log("loadPlaylist URL: " + url);
        $http.jsonp(url).success(function (data) {
            console.log("loadPlaylist URL: data: ");
            console.log(data.items);
            if (data.items.length > 0) {
                $scope.playlistTotalResults = data.pageInfo.totalResults;
                $scope.youtubeResult = $scope.youtubeResult.concat(data.items);
                $scope.startIndex += 50;
                if ($scope.startIndex < $scope.playlistTotalResults) {
                    //console.log("loading another part of the playlist... $scope.startIndex: " + $scope.startIndex);
                    $scope.loadPlaylist();
                }
                else {
                    console.log("Playlist loaded.");
                    $scope.playlistLoaded = true;
                    if (!$scope.videoFromURL) {
                        $scope.setLive();
                    }
                    else {
                        //$('#menu').collapse('hide');
                        $scope.loadVideoInfo($scope.currentVideoID, true);
                    }
                }
            }
            else {
                //console.log("error");
            }
        });
        console.log("loadPlaylist URL: " + url);
    };

    $scope.loadVideoInfo = function (videoID, andSetToCurrentVideo) {
        console.log("loadVideoInfo: " + videoID);
        var url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&alt=json-in-script&callback=JSON_CALLBACK";
        $http.jsonp(url).success(function (data) {
            if (andSetToCurrentVideo) {
                $scope.currentVideo = data.entry;
                $scope.currentVideoID = $scope.currentVideo.media$group.yt$videoid.$t;
                $scope.loadVideo($scope.currentVideo);
                console.log("SINGLE VIDEO RETRIEVED: $scope.currentVideo: ");
                console.log($scope.currentVideo);
                $scope.showNotificationBar("nowplaying");
                $scope.loadComments();
            }
        });
    };

    $scope.loadComments = function () {
        var url = "http://gdata.youtube.com/feeds/api/videos/" + $scope.currentVideoID + "/comments?v=2&alt=json-in-script&callback=JSON_CALLBACK";
        console.log("======> loadComments: " + url);
        $http.jsonp(url).success(function (data) {
            //console.log("YOUTUBE COMMENTS LOADED : $scope.commentsData.length: "+$scope.commentsData.length);
            //console.log(data.feed.entry);
            if (data.feed.entry) {
                if (!$scope.commentsData.length) {
                    $scope.commentsData = [];
                }
                for (var i = 0; i < data.feed.entry.length; i++) {
                    var comment = data.feed.entry[i];
                    var newComment = {};
                    newComment.author_name = comment.author[0].name.$t;
                    newComment.content = comment.content.$t;
                    newComment.timestamp = comment.published.$t;
                    console.log("Youtube comment: " + newComment.content);
                    //console.log(newComment);
                    $scope.commentsData.push(newComment);
                    $scope.loadCommentAuthorData(comment.author[0].uri.$t, $scope.commentsData.length - 1);
                }
                //$scope.$digest();
                //$scope.$apply();
            }
            console.log("YOUTUBE COMMENTS ADDED : $scope.commentsData.length: " + $scope.commentsData.length);
            //console.log($scope.commentsData);
        });
    };

    $scope.loadCommentAuthorData = function (_url, commentIndex) {
        $scope.isLoadingComments = true;
        var url = _url + "&callback=JSON_CALLBACK";
        //console.log("======> loadCommentAuthorData: "+url);
        $http.jsonp(url).success(function (data) {
            $scope.isLoadingComments = false;
            //console.log("AUTHOR RETRIEVED : "+data.entry.media$thumbnail.url);
            $scope.commentsData[commentIndex].author_pic = data.entry.media$thumbnail.url;
        });
    };

    $scope.setLive = function () {
        $scope.videoFromURL = false;
        if (!$scope.youtubeResult || $scope.youtubeResult.length == 0) {
            console.error("setLive() : playlist empty!");
            return;
        }
        var liveData = getPlaylistPosition($scope.youtubeResult);
        var videoIndex = liveData[0];
        if ($scope.currentVideoID == $scope.youtubeResult[videoIndex].media$group.yt$videoid.$t) {
            return;
        }
        $scope.currentVideoID = $scope.youtubeResult[videoIndex].media$group.yt$videoid.$t;
        $scope.currentVideo = $scope.youtubeResult[videoIndex];
        $scope.videoStartPosition = liveData[1];
        if (!$scope.player) {
            $scope.createPlayer();
            //window.alert("load video in PL, create player: "+$scope.currentVideoID);
        }
        else {
            //console.log("player exists. Loading video " + $scope.currentVideoID + " at " + $scope.videoStartPosition);
            //$scope.player.loadVideoById($scope.currentVideoID, $scope.videoStartPosition, 'hd720');
            //window.alert("load video in PL: "+$scope.currentVideoID);
            $scope.player.loadVideoById($scope.currentVideoID, 'hd720');
        }
    };

    $scope.loadVideo = function (video) {
        resizeWin();
        var videoID = video.snippet.resourceId.videoId;
        track(videoID);
        console.log("loadVideo()");
        if ($scope.currentVideoID != videoID) {
            $scope.currentVideoID = videoID;
            $scope.currentVideo = video;
        }
        if ($scope.currentview == "videos") {
            //$scope.setRoute("videos:" + $scope.currentVideoID);
        }
        else if ($scope.currentview == "search") {
            //$scope.setRoute("search:" + $scope.currentVideoID);
        }
        if (!$scope.player) {
            $scope.videoStartPosition = 0;
            $scope.createPlayer();
        }
        else {
            $scope.player.loadVideoById($scope.currentVideoID, 'hd720');
        }
        $scope.loadComments();
    };

    $scope.searchInGamikazeVideos = function (term) {
        if (term.length < 3) {
            return;
        }
        $scope.videoSearchResults = [];
        $scope.isSearchingYoutube = true;
        var url = "https://www.googleapis.com/youtube/v3/videos?q=" + term + "&author=TVGamikaze&part=snippet&max-results=50&callback=JSON_CALLBACK";
        $http.jsonp(url).success(function (data) {
            console.log("SEARCH DONE.");
            console.log(data);
            $scope.isSearchingYoutube = false;
            console.log("SEARCH FOUND "+data.items.length+" VIDEOS.");
            if (data.items.length > 0) {
                for (var i = 0; i < data.items.length; i++) {
                    var video = data.items[i];
                    console.log(video);
                    $scope.videoSearchResults.push(video);
                }
                //console.log("SEARCH FOUND videoSearchResults : "+$scope.videoSearchResults.length+" VIDEOS.");
            }
        });
    };

    $(function () {
        $('#content').hover(
            function () {
                if ($(bottombarHelper)) {
                    console.warn('hover: ' + $scope.showBottomBar + " $scope.bottombarLock: " + $scope.bottombarLock + " showNotificationBar: ");
                    console.warn($scope.currentVideo);
                    $(bottombarHelper).fadeIn(200);
                }
            },
            function () {
                if ($(bottombarHelper)) {
                    console.warn('hover out: ' + $scope.showBottomBar + " $scope.bottombarLock: " + $scope.bottombarLock);
                    if ($scope.showBottomBar == "chatmessage") {
                        $scope.showNotificationBar("nowplaying");
                    }
                    if ($scope.bottombarLock == 0) {
                        $scope.hideNotificationBar();
                    }
                }
            }
        );
    })
}

YoutubeCtrl.$inject = ['$scope', '$http', '$window'];