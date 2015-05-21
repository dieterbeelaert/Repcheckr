/**
 * Created by dietn on 28/11/14.
 */

var connectionMgr = require("./ConnectionManager");
var db = connectionMgr.getConnection();

function doQueryAndCallbackData(query, callback){
    db.query(query,function(error,rows,fields){
        if(error){console.log(error);}
        callback(rows);
    });
}

/*
    Spider query's
 */

/*
    Spider link query's
 */
function insertLink(link, level, productId){
    var query = "insert into spidered_links(link,level,time_spidered, product_id) select ? , ?, ?,? from dual where not exists(select link from spidered_links where link = ?);"
    db.query(query,[link,level,new Date(),productId, link], function(err,row,fields){
        if(err) console.log(err);
    });
}
module.exports.insertLink = insertLink;

function getSpideredLinks(callback) {
    doQueryAndCallbackData('select * from spidered_links',callback);
}
module.exports.getSpideredLinks = getSpideredLinks;

function insertBodyText(id, html) {
    var query = "insert into site_content(id,content) values(?,?)";
    db.query(query,[id,html],function(err,row,fields){});
}
module.exports.insertBodyText = insertBodyText;


/*
    Spider Settings querys
 */
function getKeywords(product_id, callback){
    db.query("select keyword from keywords where product_id = ?",[product_id],function(err,rows,fields){
        if(!err){
            callback(rows);
        }
    });
}
module.exports.getKeywords = getKeywords;

function getAdditionalKeywords(product_id, callback){
    db.query('select keyword from additional_keywords where product_id = ?',[product_id],function(err,rows,fields){
        if(!err){
            var kws = [];
            for(var i = 0; i < rows.length; i++){
                kws.push(rows[i].keyword);
            }
            callback(kws);
        } else{
            console.log(err);
        }
    })
}
module.exports.getAdditionalKeywords = getAdditionalKeywords;

function getSitesToIgnore(product_id,callback){
    db.query("select site from sites_to_ignore where product_id = ?",[product_id],function(err,rows,fields){
        if(!err){
            callback(rows);
        }
    });
}
module.exports.getSitesToIgnore = getSitesToIgnore;


function insertNewTweet(tweet){
    var query = "" +
        "insert into scraped_tweets(text,user,date,mood_score,product_id) " +
        "   select ?,?,?,?,? " +
        "       from dual " +
        "       where not exists(" +
        "           select text, user, date " +
        "               from scraped_tweets " +
        "               where text = ? COLLATE utf8_unicode_ci)";
    db.query(query,[tweet.text, tweet.user, tweet.date, tweet.mood,tweet.productId,tweet.text],function(err, row, fields){
        if(err) console.log(err);
    });
}
module.exports.insertNewTweet = insertNewTweet;

function getAllTweets(productId, callback){
    var query = "select * from scraped_tweets where product_id = ?";
    db.query(query,[productId],function(err,rows,fields){
        if(err) console.log(err);
        callback(rows);
    });
}
module.exports.getAllTweets = getAllTweets;

//set tweet mood in db
function setTweetMood(id,mood){
    var query = 'update scraped_tweets set mood_score = ? where id = ?';
    db.query(query,[mood,id], function(err,row,fields){})
}
module.exports.setTweetMood = setTweetMood;



//set page mood in db
function setPageMood(id,mood){
    var query = 'update spidered_links set mood_score = ? where id = ?';
    db.query(query,[mood,id],function(err,rows,fields){});
}
module.exports.setPageMood = setPageMood;


//get page + text
function getPagesWithContent(productId,callback){
    var query = 'select * from spidered_links sl join site_content sc on sl.id = sc.id where sc.content is not null and sl.product_id = ?';
    doQueryAndCallbackData(query,[productId],callback);
}
module.exports.getPagesWithContent = getPagesWithContent;


//Google autocomplete query's

//insert new autocomplete result
function insertAutoCompleteResult(acRes){
    var query = 'insert into autocom_results(content,mood_score,product_id) ' +
        'select ?,?,? ' +
        '   from dual where not exists' +
        '   (select content ' +
        '       from autocom_results' +
        '       where content = ? COLLATE utf8_unicode_ci)';
    db.query(query,[acRes.content,acRes.mood,acRes.productId,acRes.content],function(err,rows,fields){if(err)console.log(err);});
}
module.exports.insertAutoCompleteResult = insertAutoCompleteResult;

//get all data to recalculate what we have
function getAutoComMoodData(productId,callback){
    var query = 'select * from autocom_results where product_id = ?';
    doQueryAndCallbackData(query,[productId],callback);
}
module.exports.getAutoComMoodData = getAutoComMoodData;

//set mood
function setAutoComMood(acRes,mood){
    var query = 'update autocom_results set mood_score = ? where id = ?';
    db.query(query,[mood,acRes.id],function(err,rows,fields){if(err)console.log(err);});
}
module.exports.setAutoComMood = setAutoComMood;









