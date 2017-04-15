var Twitter = require('twitter');
var cascadiaWatson = require('./watson.js');
var async = require('async');

var client = new Twitter({
    consumer_key: 'edYkrMCiSd3go4a0npXEdRpEH',
    consumer_secret: 'GNjllIRHwXTQczL5xMWN0Ebj8VICxfvCYmoFkFm9rGZLh7XJ83',
    access_token_key: '24570002-z5FvKFPB1IfYHydTH2HHWsShSAh5FHHobXCoM9peq',
    access_token_secret: '7s9ARAvbKCUOCxGPdDQWsk25YIQhzcZeYU8rQCVnhapXU'
});

var getMood = function(results) {
    var sum = {
        anger: 0,
        disgust: 0,
        fear: 0,
        joy: 0,
        sadness: 0,
    }
    for(var i = 0; i < results.length; i++) {
        sum.anger += results[i].tone.anger;
        sum.disgust += results[i].tone.disgust;
        sum.fear += results[i].tone.fear;
        sum.joy += results[i].tone.joy;
        sum.sadness = results[i].tone.sadness;
    }

    var averages = [
      {
          id: "anger",
          average: sum.anger / results.length
      },
      {
          id: "disgust",
          average: sum.disgust / results.length
      },
      {
          id: "fear",
          average: sum.fear / results.length
      },
      {
          id: "joy",
          average: sum.joy / results.length
      },
      {
          id: "sadness",
          average: sum.sadness / results.length
      }
    ];

    averages.sort(function(a, b) {
        return b.average - a.average;
    });
    return averages[0].id;
}

var getTweets = function(res) {
    client.get('search/tweets', {q: '%23hackunl'}, function(error, tweets, response) {
        var formattedTweets = tweets.statuses.map(function(status) {
            // console.log(status);
            return {
                text: status.text,
                user: status.user.screen_name,
                avatar: status.user.profile_image_url_https
            };
        });

        var results = async.map(formattedTweets, cascadiaWatson.analyzeTweet, function (e, r){
            var mood = getMood(r);
            res.send(JSON.stringify({
                "mood": mood,
                "results": r
            }));
        });
    });
}

module.exports = getTweets;