/**
 * Created by dietn on 20/11/14.
 */
/*Dependencies*/
var request = require('request');
var dataHandler = require("./SQL/DataHandler");
var settings = require("./settings.json");
var cheerio = require('cheerio');
var Twitter = require('twitter');
var StatusChecker = require('./Classifier/StatusChecker.js');
var path = require('path');
var fs = require('fs');


/*global variables*/
var pageLimit = settings.pagelimit;
var keywords;
var sitesToIgnore;
var additionalKeywords = [];
var statusCheck = new StatusChecker();

var productId;

var command = process.argv[2];
productId = process.argv[3];
dataHandler.getKeywords(productId,function(kws){
    keywords = kws;
    dataHandler.getSitesToIgnore(productId,function(sti){
        sitesToIgnore = sti;
        dataHandler.getAdditionalKeywords(productId,function(akws) {
            additionalKeywords = [""].concat(akws);
            switch(command){
                case 'duckduckgo':duckduckGoSearch();
                    break;
                case 'google': googleSearch();
                    break;
                case 'autocom': doGoogleAutoComplete();
                    break;
                case 'twitter': twitterSearch();
                    break;
                case 'refresh': statusCheck.refreshMood(productId);
                    break;
                case 'help':
                default: fs.readFile(path.resolve(__dirname, 'help.txt'),['utf-8'],function(err, data){
                                            console.log(data.toString());
                                            process.exit();
                                         });
                    break;
            }
        });
    });
});


function duckduckGoSearch() {
    console.log("scraping duckduckgo for data");
    for (var i = 0; i < keywords.length; i++) {
        var timeoutTime = 0;
        var baseUrl = settings.duckduck.baseUrl[0] + keywords[i].keyword + settings.duckduck.baseUrl[1];
        for (var s = 10; s < 160; s += 20) {
            doDuckDuckRequest(baseUrl + s, timeoutTime);
            timeoutTime += 3000;
        }
    }
}

function googleSearch(){
    console.log("scraping google for data");
    for (var i = 0; i < keywords.length; i++) {
        for(var j = 0; j < additionalKeywords.length; j++) {
            var timeoutTime = 0;
            var baseUrl = settings.google.baseUrl[0] + keywords[i].keyword + ' ' + additionalKeywords[j] + "#q=" + keywords[i].keyword + ' ' + additionalKeywords[j] + settings.google.baseUrl[1];
            for (var s = 0; s < pageLimit; s += 10) {
                doGoogleRequest(baseUrl + s +  + settings.google.baseUrl[2], timeoutTime);
                timeoutTime += 3000;
            }
        }
    }
}

function doDuckDuckRequest(url,timeoutTime){
    setTimeout(function(){
        console.log(url);
        request(url,function(error,response,body){
            var res = body.replace("DDG.inject('DDG.Data.languages.resultLanguages',","");
            res = res.replace(/\);if \(nrn\) nrn\('d',[\s\S]*/,"");
            res = JSON.parse(res);
            for(var lang = 0; lang < settings.duckduck.selectedLanguages.length; lang++){
                var curLang = settings.duckduck.selectedLanguages[lang];
                if(res[curLang] != undefined) {
                    console.log("found " + res[curLang].length + " links from duckduckgo");
                    for (var j = 0; j < res[curLang].length; j++) {
                        if (typeof(res[curLang][j]) !== undefined) {
                            if (canStoreLink(res[curLang][j])) {
                                dataHandler.insertLink(res[curLang][j], 1, productId);
                            }
                        }
                    }
                }
            }
        });
    },timeoutTime);
}

function doGoogleRequest(url, timeoutTime){
    setTimeout(function(){
        request(url,function(err,resp,body){
            $ = cheerio.load(body);
            var links = $('h3.r a');
            links.each(function(){
                var link = $(this).attr('href').replace(/\/url\?q=|&sa=[\s\S]*/gi,''); //throw away the parameters added by google
                if(canStoreLink(link)){
                    dataHandler.insertLink(link,1,productId);
                }
            })
        });
    },timeoutTime);
}

function canStoreLink(url){
    console.log('canstore?');
    //in list of sites to ignore?
    for(var i = 0; i < sitesToIgnore.length; i++){
        if(url.indexOf(sitesToIgnore[i].site) !== -1) {
            console.log(url + ' ignored');
            return false ;
        }
    }
    console.log(url + ' not ignored');
    return true;
}

/*
*
* Gets data from twitter only the keyword stores and analyses it
*
 */
function twitterSearch(){
    console.log("doing twitter search");
    var tweetClient = new Twitter({
        consumer_key: settings.twitterConsumerKey,
        consumer_secret: settings.twitterConsumerSecret,
        access_token_key: settings.twitterAccessToken,
        access_token_secret: settings.twitterAccessTockensecret
    });



    //TODO GET MORE THEN 100 TWEETS PER TIME BY USING SINCE_ID
    for(var i = 0; i < keywords.length; i++){
        for(var l = 0; l < settings.twitterLangs.length; l++) {
            tweetClient.get('search/tweets', {q: keywords[i].keyword, count: 100, lang: settings.twitterLangs[l]}, function (error, tweets, response) {
                if(error){
                    console.log(error);
                }else {
                    storeTweets(tweets.statuses);
                    console.log('found: ' + tweets.statuses.length + ' tweets')
                }
            });
        }
    }
}

function storeTweets(tweets){
    //create object text, user date, mood
    for(var i = 0; i < tweets.length; i++){
        var tweet = {};
        tweet.text = tweets[i].text;
        tweet.user = tweets[i].user.screen_name;
        tweet.date = new Date(tweets[i].created_at);
        tweet.mood = statusCheck.getTweetMood(tweet.text);
        tweet.productId = productId;
        dataHandler.insertNewTweet(tweet);
    }
}

//google autocomplete using ubersuggest
function doGoogleAutoComplete() {
    console.log('getting data from google autocomplete (ubersuggest)...');
    var self = this;
    for(var k = 0; k < keywords.length; k++) {
        var keyword = keywords[k];
        for(var ak = 0; ak < additionalKeywords.length; ak++) {
            var toQuery = keyword.keyword + ' ' + additionalKeywords[ak];
            console.log(toQuery);
            request.post({
                    url: 'http://ubersuggest.org',
                    form: {query: toQuery, language: 'English/USA', source: 'web'}},
                function (err, response, body) {
                    if (!err) {
                        $ = cheerio.load(body);
                        var keywords = $('span.keyword');
                        keywords.each(function(){
                            var txt = $(this).text();
                            var toSave = {'content': txt,'mood':statusCheck.getAutocomMood(txt), 'productId': productId}
                            dataHandler.insertAutoCompleteResult(toSave);
                        });
                    } else {
                        console.log(err);
                    }
                });
        }
    }
}


