/**
 * Created with IntelliJ IDEA.
 * User: stephaneschittly
 * Date: 23/05/13
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */
angular.module('Twitter', ['ngResource']);

//http://search.twitter.com/search.json?q=blue%20angels&rpp=5&include_entities=true&result_type=mixed
//https://api.twitter.com/1.1/search/tweets.json?q=

function TwitterCtrl($scope, $resource) {
    //$scope.twitter = $resource('http://search.twitter.com/:action',
    $scope.twitter = $resource('http://search.twitter.com/:action',
        {action: 'search.json', q: 'angularjs', callback: 'JSON_CALLBACK'},
        {get: {method: 'JSONP'}});

    //$scope.searchTerm = "#callofduty";

    //$http.jsonp(url).success(function (data) {
    $scope.doSearch = function () {
        $scope.twitterResult = $scope.twitter.get({q: $scope.searchTerm}, function () {
            console.log($scope.twitterResult.results.length);
            var tweet;
            for (var i = 0; i < $scope.twitterResult.results.length; i++) {
                console.log("$scope.twitterResult[i].created_at: " + $scope.twitterResult.results[i].created_at);
                tweet = $scope.twitterResult.results[i];
                tweet.created_at = parseTwitterDate(tweet.created_at);
                //tweet.createdDate = new Date(Date.parse(tweet.created_at));
                console.log("$scope.twitterResult[i].createdDate: "+tweet.created_at);
            }
            console.log($scope.twitterResult);
        });
    };

    //from http://plnkr.co/edit/0GRLdWPJOzGFY14irxLT?p=preview
}



//from http://stackoverflow.com/questions/6549223/javascript-code-to-display-twitter-created-at-as-xxxx-ago
function parseTwitterDate(tdate) {
    var system_date = new Date(Date.parse(tdate));
    var user_date = new Date();
    if (K.ie) {
        system_date = Date.parse(tdate.replace(/( \+)/, ' UTC$1'))
    }
    var diff = Math.floor((user_date - system_date) / 1000);
    if (diff <= 1) {return "just now";}
    if (diff < 20) {return diff + " seconds ago";}
    if (diff < 40) {return "half a minute ago";}
    if (diff < 60) {return "less than a minute ago";}
    if (diff <= 90) {return "one minute ago";}
    if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
    if (diff <= 5400) {return "1 hour ago";}
    if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
    if (diff <= 129600) {return "1 day ago";}
    if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
    if (diff <= 777600) {return "1 week ago";}
    return "on " + system_date;
}

// from http://widgets.twimg.com/j/1/widget.js
var K = function () {
    var a = navigator.userAgent;
    return {
        ie: a.match(/MSIE\s([^;]*)/)
    }
}();