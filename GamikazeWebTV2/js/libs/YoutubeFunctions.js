/**
 * Created with IntelliJ IDEA.
 * User: stephaneschittly
 * Date: 26/05/13
 * Time: 20:49
 * To change this template use File | Settings | File Templates.
 */
//var playlistId = 'PLVEH4RPM7HlaRnOhnwoP62vWikMGJdwa9';
//var playlistURL = 'http://gdata.youtube.com/feeds/api/playlists/' + playlistId + '?v=2&max-results=50&alt=json';
var videoIndex;
var videoId;
var videoPosition;

function initFallback() {
    if (getUrlVars().length > 1) {
        videoId = getUrlVars()[1];
        //console.log('Loading intro video http://youtube.com/watch?v=' + videoId);
        loadIntroVideo();
    }
    else {
        console.log('Loading playlist... ');
        $.getJSON(playlistURL, function (data) {
            //console.log(data);
            //console.log('Playlist loaded, ' + data.feed.entry.length + ' videos.');
            liveDataRetrieved(data);
        });
    }
    $('#stopVideoBtn').click(function () {
        stopVideo();
    });
}

function getUrlVars() {
    var ret = [];
    var sURL = window.parent.document.URL.toString();
    if (sURL.indexOf("?") > 0) {
        var arrParams = sURL.split("?");
        var extraParams = sURL.split("&");
        if (arrParams) {
            ret = arrParams;
        }
        else {
            ret = extraParams;
        }
    }
    return ret;
}

function getPlaylistDuration(playlist) {
    var ret = 0;
    //console.log("getPlaylistDuration: " + playlist.length + " videos");
    //TODO: WHAT TO DO WHEN YOUTUBE DOESNT RETURN A VIDEO DURATION? RARE BUT IT HAPPENS
    var videoDuration = 180;
    for (var index = 0; index < playlist.length; index++) {
        if (playlist[index].media$group.yt$duration) {
            videoDuration = playlist[index].media$group.yt$duration.seconds;
           // console.log(index + " > " + playlist[index].title.$t + " duration: " + videoDuration);
        }
        else {
            videoDuration = 180;
        }
        ret += parseInt(videoDuration);
    }
    return ret;
}

function getPlaylistPosition(playlist) {
    var ret = [];
    var playlistDuration = getPlaylistDuration(playlist);
    var videoDuration = 180;
    var currentTime = new Date();
    var currentTimeAtStartOfDay = new Date();
    var secondsElapsedInDay = (currentTime.getUTCHours()) * 60 * 60 + currentTime.getUTCMinutes() * 60 + currentTime.getUTCSeconds();
    var playlistLoopIndexInDay = Math.floor(secondsElapsedInDay / playlistDuration);
    var restOfTime;
    if (playlistLoopIndexInDay > 0) {
        restOfTime = secondsElapsedInDay - (playlistLoopIndexInDay * playlistDuration);
    }
    else {
        restOfTime = playlistDuration - secondsElapsedInDay;
    }
    var currentCumulativeDuration = 0;
    for (var index = 0; index < playlist.length; index++) {
        if (playlist[index].media$group.yt$duration) {
            videoDuration = playlist[index].media$group.yt$duration.seconds;
        }
        else {
            videoDuration = 180;
        }
        currentCumulativeDuration += parseInt(videoDuration);
        if (currentCumulativeDuration > restOfTime) {
            var returnIndex = index;
            var atPosition = videoDuration - (currentCumulativeDuration - restOfTime);
            break;
        }
    }
    ret.push(returnIndex);
    ret.push(atPosition);
    return ret;
}

function getVideoInPlaylist(playlist, videoid)
{
    for (var index = 0; index < playlist.length; index++)
    {
        //console.log("comparing "+playlist[index].media$group.yt$videoid.$t+" to "+videoid);
        if (playlist[index].media$group.yt$videoid.$t == videoid) {
            //console.log("found: ");
            //console.log(playlist[index]);
            return playlist[index];
        }
    }
    return null;
}

function getNextVideoInPlaylist(playlist, currentVideoID)
{
    var tmpIndex = -1;
    for (var index = 0; index < playlist.length; index++)
    {
        if (playlist[index].media$group.yt$videoid.$t == currentVideoID) {
            //console.log("found: ");
            //console.log(playlist[index]);
            tmpIndex = index;
        }
    }
    if(tmpIndex != -1)
    {
        if(tmpIndex < playlist.length-1)
        {
            return playlist[tmpIndex+1];
        }
        else
        {
            return playlist[0];
        }
    }
    return null;
}