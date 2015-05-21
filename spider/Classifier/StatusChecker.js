/**
 * Created by dietn on 17/01/15.
 */

var dataHandler = require('../SQL/DataHandler');
var sentiment = require('sentiment');

function StatusChecker(){

}
module.exports = StatusChecker;


StatusChecker.prototype.getPageMood = function(pageText){
    return getSentimentScore(pageText);
}


//find the mood by using http://www.umiacs.umd.edu/~saif/WebPages/Abstracts/NRC-SentimentAnalysis.htm !! don't forget to quote the paper
StatusChecker.prototype.getTweetMood = function(tweetText){
    return getSentimentScore(tweetText);
}

/*
*
*   Categorizes the google autocomplete results
*
 */
StatusChecker.prototype.getAutocomMood = function(text){
    return getSentimentScore(text);
}

/*
*
* This will refresh the mood on every spidered link
*
 */
StatusChecker.prototype.refreshMood = function(productId){
    dataHandler.getPagesWithContent(function (pages) {
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
                var newMood = sentinent(page.content);
                dataHandler.setPageMood(page.id, newMood).score;
        }
    });


    dataHandler.getAutoComMoodData(function (productId,data) {
        for (var i = 0; i < data.length; i++) {
            var acRes = data[i];
            var newMood = getSentimentScore(acRes.content);
            dataHandler.setAutoComMood(acRes, newMood);
        }
    });

    dataHandler.getAllTweets(function(productId,data){
       for(var i = 0; i < data.length; i++){
           var mood = getSentimentScore(data[i].text);
           dataHandler.setTweetMood(data[i].id,mood);
       }
    });
}

function getSentimentScore(text){
    var res = sentiment(text);
    return res.score;
}

