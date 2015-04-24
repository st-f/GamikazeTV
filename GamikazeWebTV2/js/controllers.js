'use strict';

angular.module('gamikaze.controllers', []);
//angular.module('gamikaze.controllers', ['ngResource']);

function SimpleViewCtrl($scope) {
}

SimpleViewCtrl.$inject = ['$scope'];

function ShareViewCtrl($scope, Facebook) {
    $scope.sendMessage = function () {
        //console.log("sendMessage(): " + $scope.currentVideoID);
        Facebook.sendMessage($scope.currentVideo, $scope.currentVideoID);
    }

    $scope.postToFeed = function () {
        //console.log("postToFeed(): " + $scope.currentVideoID);
        Facebook.postToFeed($scope.currentVideo, $scope.currentVideoID);
    }

    //TWITTER
    $scope.tweetVideo = function () {
        var text = encodeURIComponent('#GTV_' + $scope.currentVideoID + ' - Watch ' + $scope.currentVideo.title.$t + ' on Gamikaze.TV: ');
        //We get the URL of the link
        var loc = encodeURIComponent('@GamikazeTV - http://gamikaze.tv/#/videos:' + $scope.currentVideoID);
        //var via = "Gamikaze.TV"
        var reqURL = 'http://twitter.com/share?url=' + loc + '&text=' + text;
        //console.log("tweetAboutUs: " + reqURL);
        window.open(reqURL, 'twitterwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 225) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    }

    $scope.tweetAboutUs = function () {
        var text = encodeURIComponent('#GTV @GamikazeTV - Gamikaze.TV - The Real Gaming TV, 24/7. Updated daily.');
        //We get the URL of the link
        var loc = encodeURIComponent('http://www.gamikaze.tv');
        //var via = "Gamikaze.TV"
        var reqURL = 'http://twitter.com/share?url=' + loc + '&text=' + text;
        //console.log("tweetAboutUs: " + reqURL);
        window.open(reqURL, 'twitterwindow', 'height=450, width=550, top=' + ($(window).height() / 2 - 225) + ', left=' + $(window).width() / 2 + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
    }

    //EMAIL
    $scope.sendVideoByEmail = function () {
        var text = encodeURIComponent($scope.currentVideo.title.$t + ' on Gamikaze.TV.');
        //We get the URL of the link
        var url = 'http://gamikaze.tv/#/videos:' + $scope.currentVideoID;
        var loc = encodeURIComponent('<a href="' + url + '">' + url + '</a>');
        document.location.href = "mailto:?Subject=" + text + "&body=" + loc;
    }
}

ShareViewCtrl.$inject = ['$scope', 'Facebook'];

//function LiveViewCtrl($scope) {
//    console.log("LIVE");
//    $scope.setLive();
//}

//LiveViewCtrl.$inject = ['$scope'];

function SearchViewCtrl($scope, $location) {
    //console.log("SEARCHVIEWCTRL ----");
}

SearchViewCtrl.$inject = ['$scope', '$location'];

function VideosViewCtrl($scope, $location) {
    $scope.scrollToSelectedVideo = function () {
        //console.log("scrollToSelectedVideo()")
        if ($scope.currentVideoID && $('#playlistMenuDiv')) {
            //console.log("scroll to video: " + $scope.currentVideoID);
            var selected = $('#playlistMenuDiv').find('#' + $scope.currentVideoID);
            if (selected) {
                $('#playlistMenuDiv').scrollTo(selected, {duration: 0});
            }
        }
    };
    if ($location.$$path.substring(1) == "videos" && !$scope.currentVideoID) {
        //console.log("#videos: current video id: " + $scope.currentVideoID);
        //no videoID defined: we play live
        $scope.setLive();
        setTimeout($scope.scrollToSelectedVideo, {duration: 0});
    }
    else if ($scope.currentVideoID) {
        setTimeout($scope.scrollToSelectedVideo, {duration: 0});
    }
}

VideosViewCtrl.$inject = ['$scope', '$location'];

function CommentsCtrl($scope, $http, $window) {
    $scope.method = 'POST';
    $scope.getURL = 'GTVPHPServer/getComments.php';
    $scope.insertURL = 'GTVPHPServer/insertComment.php';
    //$scope.comment = {};

    $scope.commentsData.length = 0;

    if ($scope.currentview == 'live') {
        console.log("LIVE");
        $scope.setLive();
    }

    $scope.$watch('currentVideoID', function (newval, oldval) {
        console.log("CURRENT VIDEO CHANGED. " + newval + " old: " + oldval + " $scope.currentView: " + $scope.currentview);
        if (newval != oldval && $scope.currentview != 'live') {
            $scope.commentsData = [];
            $window.document.title = $scope.currentVideo.title.$t + "Gamikaze.TV - The Real Gaming TV, 24/7. Updated daily.";
            $scope.getComments();
            if($scope.getCommentsTimer == 0) {
                setInterval(function () {
                    if ($scope.player) {
                        if ($scope.currentVideoID && $scope.isLoadingComments == false && $scope.isSendingComment == false && $scope.currentview != 'live') {
                            $scope.getComments();
                        }
                    }
                }, 5000);
                $scope.getCommentsTimer = 1;
            }
        }
    });

    $scope.getComments = function () {
        if (!$scope.currentVideoID) {
            return;
        }
        $scope.isLoadingComments = true;
        var videoIDToSend = $scope.currentVideoID;
        var lastCommentIDToLoad;

        if ($scope.currentview == 'live') {
            videoIDToSend = 'live';
            lastCommentIDToLoad = $scope.lastChatCommentIDLoaded;
        }
        else
        {
            lastCommentIDToLoad = $scope.lastCommentIDLoaded;
        }
        console.log("getComments()... " + $scope.currentview + ", last loaded: " + lastCommentIDToLoad + " $scope.currentVideoID: " + $scope.currentVideoID);

        $http({method: $scope.method, url: $scope.getURL, data: {videoID: videoIDToSend, lastCommentID: lastCommentIDToLoad}}).
            success(function (data, status) {
                //console.log("Comments before adding YT comments: " + $scope.commentsData.length);
                if (!data[0]) {
                    console.log("No new comments. Last index: " + $scope.lastCommentIDLoaded);
                    $scope.isLoadingComments = false;
                    return;
                }
                if (data[0]) {
                    console.warn("Comments retrieved from GTV server: " + $scope.commentsData.length+" currentview? "+$scope.currentview);
                    if ($scope.currentview == 'live') {
                        $scope.lastChatCommentIDLoaded = data[data.length - 1].idcomment;
                    }
                    else
                    {
                        $scope.lastCommentIDLoaded = data[data.length - 1].idcomment;
                    }
                    for (var i = 0; i < data.length; i++) {
                        data[i].timestamp = prettyDate(data[i].timestamp);
                        //console.log(" > comment.content: " + data[i].idcomment);
                        //$scope.commentsData.push(data[i]);
                        $scope.commentsData.unshift(data[i]);
                    }
                    //console.log($scope.commentsData);
                }
                $scope.isLoadingComments = false;
            }).
            error(function (data, status) {
                //$scope.commentsData = data || "Request failed";
                console.error("CANT LOAD COMMENTS.");
            });
    };

    $scope.insertComment = function () {
        $scope.isSendingComment = true;
        if ($scope.comment.content == undefined
            || $scope.comment.content.length == 0
            || $scope.user.author_name == undefined
            || $scope.user.author_name.length == 0) {

            if ($scope.user.author_name == undefined
                || $scope.user.author_name.length == 0) {
                $scope.user.author_name = "(anon)";
            }
            //return;
        }
        $scope.comment.ytVideoID = $scope.currentVideoID;
        if ($scope.currentview == 'live') {
            $scope.comment.ytVideoID = 'live';
        }

        //$scope.comment.timestamp = prettyDate(new Date());
        $scope.comment.author_pic = $scope.user.pic;
        if (!$scope.user.origin) {
            $scope.user.origin = "";
        }
        if ($scope.user.author_name.substr($scope.user.author_name.length - 6) != "(anon)"
            && $scope.user.origin != "facebook") {
            $scope.user.author_name += " (anon)";
        }
        else {
            if ($scope.user.origin != "facebook") {
                $scope.comment.author_pic = "img/anon44.jpg";
            }
        }
        $scope.comment.author_name = $scope.user.author_name;

        //SEND VIA WEBSOCKET
        if ($scope.currentview == 'live')
        {
            console.warn("SENDING MSG TO WEBSOCKET");
            $scope.conn.send(JSON.stringify($scope.comment));
        }

        //store user name
        localStorage.gtv_userDisplayName = $scope.comment.author_name;
        $http({method: $scope.method, url: $scope.insertURL, data: $scope.comment}).
            success(function (data, status) {
                console.log("comment added at " + data + ", status: " + status);
                if ($scope.currentview == 'live')
                {
                    $scope.lastCommentIDChatLoaded = data;
                }
                else
                {
                    $scope.lastCommentIDLoaded = data;
                    console.warn("COMMENT INSERTED. LAST COMMENT ID: "+$scope.lastCommentIDLoaded);
                }
                var tmp = {};
                angular.copy($scope.comment, tmp);
                $scope.commentsData.unshift(tmp);
                //console.log(tmp);
                $scope.comment.content = "";
                $scope.comment.timestamp = new Date();
                data[i].timestamp = prettyDate($scope.comment.timestamp);
                $scope.isSendingComment = false;
                //$scope.getComments();
            }).
            error(function (data, status) {
                window.alert("error while adding comment: " + data + ", status: " + status);
            });
    };
}

CommentsCtrl.$inject = ['$scope', '$http', '$window'];