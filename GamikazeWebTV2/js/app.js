/**
 * Created with IntelliJ IDEA.
 * User: stephaneschittly
 * Date: 22/05/13
 * Time: 17:21
 * To change this template use File | Settings | File Templates.
 */

//var app = angular.module('app', ['ngResource', 'gamikaze.controllers', 'gamikaze.youtube', 'gamikaze.facebook']).
var app = angular.module('app', ['gamikaze.controllers', 'gamikaze.youtube', 'gamikaze.facebook']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!'); //NEEDED FOR FACEBOOK SCRAPING?
        $routeProvider.
            when('/live', {template: 'views/sidebar/ChatSidebar.html', controller: 'CommentsCtrl'}).
            when('/comment', {template: 'views/sidebar/ChatSidebar.html', controller: 'CommentsCtrl'}).
            when('/videos:videoURL', {template: 'views/sidebar/PlaylistSidebar.html', controller: 'VideosViewCtrl'}).
            when('/share', {template: 'views/sidebar/ShareSidebar.html', controller: 'ShareViewCtrl'}).
            when('/search:videoURL', {template: 'views/sidebar/SearchSidebar.html', controller: 'SearchViewCtrl'}).
            otherwise({redirectTo: '/live', template: 'views/sidebar/DefaultSidebar.html', controller: 'SimpleViewCtrl'});
    }]);

function MainCtrl($scope, $rootScope, $location, $http, $timeout, $window, Facebook) {
    $scope.currentview = "home";
    $scope.showBottomBar = "loading";
    $scope.remainingTime = 0;
    $scope.commentsData = [];
    $scope.isLoadingComments = false;
    $scope.isSendingComment = false;
    $scope.lastCommentIDLoaded = 0;
    $scope.lastChatCommentIDLoaded = 0;
    $scope.getCommentsTimer = 0;
    $scope.currentVideo = {};
    $scope.nextVideo = {};
    $scope.currentVideoID = -1;
    $scope.videoFromURL = false;
    $scope.currentChatMessage = {};
    //comments
    $scope.comment = {};
    $scope.commentsData = [];
    //user profile
    //console.log("USER? " + localStorage.gtv_userDisplayName);
    if (localStorage.gtv_userDisplayName) {
        $scope.user = {author_name: localStorage.gtv_userDisplayName};
    }
    else {
        $scope.user = {};
    }
    $scope.user.pic = "img/anon44.jpg";

    $scope.setRoute = function (route) {
        $location.path(route);
        //set route
        if (route != '') {
            if ($('#menu')[0].className.indexOf('in') != -1) {
                var shortRoute = route.replace(/\//g, '');
                console.log("MENU IS OPEN: currentView: " + $scope.currentview + " route: " + shortRoute);
                if ($scope.currentview == shortRoute) {
                    console.log('=======================( HIDE )========================');
                    $('#content').width($window.innerWidth - 90);
                    /*if ($('#player')) {
                        $('#player').width($window.innerWidth - 90);
                    }*/
                    $('#menu').collapse('hide');

                }
                else if(route.indexOf('videos:') != -1)
                {
                    $('#menu').collapse('hide');
                }
            }
            else {
                if (route.indexOf('videos:') == -1 || route.indexOf('search:') == -1) {
                    console.log('=======================( SHOW: ' + $('#content').width() + ' )========================');
                    $('#content').width($window.innerWidth - 440);
                    if ($('#player')) {
                        $('#player').width($window.innerWidth - 440);
                    }
                    $('#menu').collapse('show');
                }
            }
            resizeWin();
        }
        //check if video from URL
        if (route.indexOf('videos:') != -1 || route.indexOf('search:') != -1) {
            if (route.indexOf('search:') != -1) {
                $scope.currentview = 'search';
            }
            else {
                console.warn("URL CONTAINS VIDEOS:");
                $scope.videoFromURL = true;
                $scope.currentview = 'videos';
                $('#menu').collapse('hide');
            }
            $location.path(route);
            var videosRouteAry = route.split(":");
            var tmpID = videosRouteAry[1];
            $scope.currentVideoID = tmpID;
            if ($scope.youtubeResult) {
                if (getVideoInPlaylist($scope.youtubeResult, tmpid)) {
                    //console.log("FOUND VIDEO IN PLAYLIST");
                }
                else {
                    //console.log("FOUND NOT VIDEO IN PLAYLIST");
                }
            }
            else {
                $scope.videoFromURL = true;
                //console.log("NO PLAYLIST YET.");
            }
        }
        else {
            $scope.currentview = route.replace(/\//g, '');
        }
        $scope.status = 'ready';
        mixpanel.track($scope.currentview);
        /* $timeout(function () { // wait for DOM, then restore scroll position
         //console.log("timeout done, scrolling to " + $scope.scrollPos[$location.path()]);
         $(container).scrollTop($scope.scrollPos[$location.path()] ? $scope.scrollPos[$location.path()] : 0);
         $scope.okSaveScroll = true;
         }, 50);*/
    }

    //set route at init.
    $scope.setRoute($location.$$path.substring(1));
    $scope.status = 'ready';

    //scroll
    //$scope.scrollPos = {};

    //CHAT
    $scope.conn = new WebSocket("ws://gamikaze.tv:8080");

    $scope.conn.onopen = function(e) {
        console.log("Connected to WebSocket server.");
    };

    $scope.conn.onerror = function(e) {
        console.log("onerror");
        console.log(e);
    };
    $scope.conn.onclose = function(e) {
        console.log("onclose");
        console.log(e);
    };

    //FACEBOOK
    $scope.login = function () {
        Facebook.login();
    };

    $scope.logout = function () {
        Facebook.logout();
        $scope.user = {};
        $scope.user.pic = "img/anon44.jpg";
        //$scope.$digest();
    };
    $rootScope.$on('fb_logout_succeded', function (event, args) {
        //console.log("USER LOGGED OUT.");
    });
    $rootScope.$on('fb_logout_failed', function (event, args) {
        //console.log("CANNOT LOGGED OUT USER.");
    });

    $scope.getInfo = function () {
        Facebook.getUserInfo();
    };

//    $scope.shareVideo = function () {
//        Facebook.share();
//    }

    $rootScope.$on("fb_user_retrieved", function (event, args) {
        $scope.user.author_name = args.facebook_user.name;
        //console.log(args);
        if ($scope.user.author_name) {
            $scope.user.origin = "facebook";
            $scope.user.pic = "http://graph.facebook.com/" + args.facebook_user.id + "/picture";
        }
        else {
            $scope.user.origin = "";
            $scope.user.pic = "img/anon44.jpg"
        }
        //console.log("USER RETRIEVED: $scope.user.pic: " + $scope.user.pic + " $scope.user.author_name: " + $scope.user.author_name);
        //console.log($scope.user);
        $scope.$digest();
        //console.log(args);
    });
}

window.onresize = resizeWin;

function resizeWin() {
    //console.warn("RESIZEWIN");
    var height = window.innerHeight;//Firefox
    var width = window.innerWidth;//Firefox
    if (document.body.clientHeight) {
        height = document.body.clientHeight;//IE
    }
    if (document.body.clientWidth) {
        width = document.body.clientWidth;//IE
    }
    iframeDiv = document.getElementById("player");

    var futureWidth;
    if ($('#menu')[0].className.indexOf('in') != -1) {
        futureWidth = width - 440;
        //menu is only 250px on small screens
        //console.log("MENU IS OPEN: width: " + width);
        if (width < 840) {
            futureWidth += 150;
            //console.log("MENU IS OPEN: futureWidth: " + futureWidth);
        }
    }
    else {
        //console.log("MENU IS CLOSED");
        futureWidth = width - 90;
    }
    if (iframeDiv) {
        iframeDiv.style.height = parseInt(height - iframeDiv.offsetTop - 60) + "px";
        //iframeDiv.style.width = parseInt(width - 90) + "px"; //90 is closed sidebar width
        //iframeDiv.style.width = parseInt(width - 440) + "px"; //440 is opened sidebar width
        iframeDiv.style.width = futureWidth + "px"; //440 is opened sidebar width
    }
}

$(window).load(function () {
    resizeWin();
    //initLocalization();
});

//FB
app.run(function (Facebook) {
    //console.log("APP RUN, INIT FB");
    window.fbAsyncInit = function () {
        FB.init({
            appId: '514569015253582',
            status: true,
            cookie: true,
            xfbml: true
        });

        FB.Event.subscribe('auth.authResponseChange', function (response) {
            // Here we specify what we do with the response anytime this event occurs.
            //console.log("FB STATUS: " + response.status);
            //console.log(response);
            if (response.status === 'connected') {
                Facebook.getUserInfo();
            } else if (response.status === 'not_authorized') {
                // In this case, the person is logged into Facebook, but not into the app, so we call
                // FB.login() to prompt them to do so.
                //FB.login();
            } else {
                // In this case, the person is not logged into Facebook, so we call the login()
                //FB.login();
            }
        })
    };

    // Load the SDK asynchronously
    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "//connect.facebook.net/en_US/all.js";
        ref.parentNode.insertBefore(js, ref);
    }(document));

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});