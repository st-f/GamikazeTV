/*
 *
 Ok... After wasting my full day i got a answer. Using Javascript_Facebook Sdk, when you click on Login button, it will open popup window. And in Safari or iPhone(mine), i enable Block-popup option.
 Therefore i am not able to see Facebook login window. you need to allow pop-up window.
 You can allow pop-up by clicking on

 Safari-disable Block pop-up windows
 or

 safari-preference-then disable checkbox of pop-up window's
 or You can use a keyboard shortcut:

 shift-[command key]-K.
 cheers.
 * */

var app = angular.module('gamikaze.facebook', []);

app.factory('Facebook', function ($rootScope) {
    var videoID = 1;
    return {
        getLoginStatus:function () {
            FB.getLoginStatus(function (response) {
                //console.log("FB LOGIN STATUS");
                //console.log(response);
                //$rootScope.$broadcast("fb_statusChange", {'status':response.status});
            }, true);
        },
        getUserInfo:function () {
            FB.api('/me', function(response) {
                $rootScope.$broadcast('fb_user_retrieved', {facebook_user:response});
            });
        },
        share:function () {
            window.open('http://www.facebook.com/sharer.php?u=http://www.youtube.com/watch?v=zAC6SYHEaRM');
            var share = {
                method: 'stream.share',
                u: 'http://www.youtube.com/watch?v=zAC6SYHEaRM'
            };
            FB.ui(share, function(response) { console.log(response); });
        },
        postToFeed:function (video, videoID) {
            //console.log("Facebook.postToFeed("+videoID+")");
            // calling the API ...
            var obj = {
                method: 'feed',
                link: 'http://gamikaze.tv/?'+videoID,
                picture: video.media$group.media$thumbnail[0].url,
                source: 'http://www.youtube.com/v/'+videoID+'?autohide=1&amp;version=3',
                /*media:[{"type": "flash",
                 "swfsrc": 'http://www.youtube.com/v/'+videoID+'?autohide=1&amp;version=3',
                 "imgsrc": video.media$group.media$thumbnail[0].url,
                 "expanded_width": "500",
                 "expanded_height": "285"}],*/
                name: video.title.$t+' on Gamikaze.TV',
                caption: 'http://www.gamikaze.tv',
                description: video.media$group.media$description.$t
            };
            function callback(response) {
                //console.log(response);
                //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            }
            FB.ui(obj, callback);
        },
        sendMessage:function (video, videoID) {
            //console.log("Facebook.sendMessage()");
            var obj2 = {
                method: 'send',
                link: 'http://gamikaze.tv/?'+videoID,
                picture: video.media$group.media$thumbnail[0].url,
                source: 'http://www.youtube.com/v/'+videoID+'?autohide=1&amp;version=3',
                name: video.title.$t+' on Gamikaze.TV',
                caption: 'http://www.gamikaze.tv',
                description: video.media$group.media$description.$t
            };
            function callback2(response) {
                //console.log(response);
                //document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
            }
            FB.ui(obj2, callback2);
        },

        login:function () {
            //NOT USED ANYMORE COZ IT JUST DOESNT WORK. CALL FB.login() DIRECTLY INSTEAD IN HTML


            //console.log("LOGIN TO FB SERVICE CALLED.");
            FB.getLoginStatus(function (response) {
                //console.log("getLoginStatus: "+response.status);
                //console.log(response);
                switch (response.status) {
                    case 'connected':
                        $rootScope.session = response.authResponse;
                        break;
                    case 'unknown':
                        //console.log("CASE UNKNOWN");
                        // 'not_authorized' || 'unknown': doesn't seem to work
                        //FB.login();
                        /*FB.login(function (response) {
                            console.log("FB.login: "+response.status);
                            if (response.authResponse) {
                                $rootScope.$broadcast('fb_connected', {
                                    facebook_id:response.authResponse.userID,
                                    userNotAuthorized:true
                                });
                            } else {
                                $rootScope.$broadcast('fb_login_failed');
                            }
                        }, {scope:'publish_stream, publish_actions'});*/
                        break;
                    default:
                        console.log("CASE DEFAULT");
                        FB.login(function (response) {
                            if (response.authResponse) {
                                //$rootScope.$broadcast('fb_connected', {facebook_id:response.authResponse.userID});
                                //$rootScope.$broadcast('fb_get_login_status');
                            } else {
                               // $rootScope.$broadcast('fb_login_failed');
                            }
                        });
                        break;
                }
            }, true);
        },
        logout:function () {
            //console.log("LOGGING OUT...");
            FB.logout(function (response) {
                //console.log("LOGOUT: ");
                //console.log(response);
                if (response) {
                    //$rootScope.$broadcast('fb_logout_succeded');
                } else {
                    //$rootScope.$broadcast('fb_logout_failed');
                }
            });
        },
        unsubscribe:function () {
            FB.api("/me/permissions", "DELETE", function (response) {
                //$rootScope.$broadcast('fb_get_login_status');
            });
        }
    };
});
