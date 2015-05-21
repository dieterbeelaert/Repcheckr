/**
 * Created by dietn on 19/12/14.
 */
var Controller = require('./Controller.js');


/*Constructor*/
function StatsController(req,res,ctx){
    console.log("init statscontroller");
    this.prototype = new Controller(req,res,ctx);
}
module.exports = StatsController;

StatsController.prototype.doRequest = function(){
    var self = this;
    self.prototype.setResJSON(); //this controller always returns JSON
    console.log(self.prototype.ctx.routeObj);
    switch(self.prototype.ctx.routeObj.action){
        case 'spiders': self.getSpideredLinks();
            break;
        case 'scraped': self.getScrapedPages();
            break;
        case 'tweets': self.getAllTweets();
            break;
        case 'score': self.getReputationScore();
            break;
        case 'get':
        default:
            self.getStats();
            break;
    }
}

StatsController.prototype.getStats = function(){
    var self = this;
    if(self.prototype.ctx.routeObj.id !== undefined) {
        self.prototype.db.getStats(self.prototype.ctx.routeObj.id, function (json) {
            self.prototype.returnJSON(json);
        });
    }else{
        self.prototype.res.end();
    }
}

StatsController.prototype.getSpideredLinks = function(){
    var self = this;
    self.prototype.db.getSpideredLinks(function(json){
        self.prototype.returnJSON(json);
    });
}


StatsController.prototype.getScrapedPages = function(){
    var self = this;
    self.prototype.db.getScrapedPages(function(json){
        self.prototype.returnJSON(json);
    });
}

StatsController.prototype.getAllTweets = function(){
    var self = this;
    self.prototype.db.getAllTweets(function(json){
        self.prototype.returnJSON(json);
    });
}

StatsController.prototype.getReputationScore = function(){
    var self = this;
    var id = self.prototype.ctx.routeObj.id;
    var linkScore = 0;
    var tweetScore = 0;
    var autocomScore = 0;
    self.prototype.db.getSpideredLinksByProductId(id,function(links){
       for(var i = 0; i < links.length; i++){
          linkScore += links[i].mood_score === 0 ? 1 : links[i].mood_score;
       }
       self.prototype.db.getTweetsByProductID(id,function(tweets){
           for(var i = 0; i < tweets.length; i++){
               tweetScore += tweets[i].mood_score === 0 ? 1 : tweets[i].mood_score;
           }
           self.prototype.db.getAutoComResultsByProductId(id,function(acomRes){
              for(var i = 0; i < acomRes.length; i++){
                  autocomScore+= acomRes[i].mood_score === 0 ? 1 : acomRes[i].mood_score;
              }
              var response = {
                  'linkScore': linkScore,
                  'tweetScore' : tweetScore,
                  'autocomScore': autocomScore,
                  'totalScore' : linkScore + tweetScore + autocomScore
              };

              self.prototype.returnJSON(response);
           });
       });
    });
}

