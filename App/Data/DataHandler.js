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


function getProducts(callback){
    var query = 'select * from product';
    doQueryAndCallbackData(query,callback);
}
module.exports.getProducts = getProducts;

function getStats(product_id,callback){
  var query = 'select (select count(*) from spidered_links where product_id = ?) as total_pages,' +
      '(select count(*) from spidered_links where mood_score < 0 and product_id = ?) as negative_pages,' +
      '(select count(*) from spidered_links where mood_score >= 0 and product_id = ?) as positive_pages,' +
      '(select count(*) from scraped_tweets where product_id = ?) as total_tweets,' +
      '(select count(*) from scraped_tweets where mood_score < 0 and product_id = ?) as negative_tweets,' +
      '(select count(*) from scraped_tweets where mood_score >= 0 and product_id = ?) as positive_tweets,' +
      '(select count(*) from autocom_results where product_id = ?) as total_autocom,' +
      '(select count(*) from autocom_results where mood_score < 0 and product_id = ?) as negative_autocom,' +
      '(select count(*) from autocom_results where mood_score >= 0 and product_id = ?) as positive_autocom'

    var param = [];
    for(var i = 0; i < 9; i++){
        param.push(product_id);
    }

    db.query(query,param,function(error,rows,fields){
        if(error){console.log(error);}
        callback(rows);
    });
}
module.exports.getStats = getStats;

function getSpideredLinks(callback){
    var query = 'select * from spidered_links';
    doQueryAndCallbackData(query, callback);
}
module.exports.getSpideredLinks = getSpideredLinks;

function getAllTweets(callback){
    var query = 'select user, text, date, mood_score from scraped_tweets';
    doQueryAndCallbackData(query, callback);
}
module.exports.getAllTweets = getAllTweets;

/*Queries needed to calculate reputation score*/
function getSpideredLinksByProductId(id,callback){
    var query = 'select * from spidered_links where product_id = ?';
    db.query(query,[id],function(err,rows,fields){
        if(err){console.log(err)}
        callback(rows);
    });
}
module.exports.getSpideredLinksByProductId = getSpideredLinksByProductId;

function getTweetsByProductId(id,callback){
    var query = 'select * from scraped_tweets where product_id = ?';
    db.query(query,[id],function(err,rows,fields){
        if(err){console.log(err)}
        callback(rows);
    })
}
module.exports.getTweetsByProductID = getTweetsByProductId;

function getAutocomResultsByProductId(id,callback){
    var query = 'select * from autocom_results where product_id = ?';
    db.query(query,[id],function(err,rows,fields){
        if(err){console.log(err)}
        callback(rows);
    })
}
module.exports.getAutoComResultsByProductId = getAutocomResultsByProductId;


/*processes queries */
function insertProcess(pid,name){
    var query = "insert into running_processes(pid,script_name) values (?,?)";
    db.query(query,[pid,name],function(err,row,fields){
       if(err)
        console.log(err);
    });
}
module.exports.insertProcess = insertProcess;

function removeProcess(pid,name){
    var query = "delete from running_processes where pid = ? and script_name = ?";
    db.query(query,[pid,name],function(err,row,fields){
        if(err){
            console.log(err);
        }
    });
}
module.exports.removeProcess = removeProcess;

function getPidOfProcess(name,callback){
    var query = 'select pid from running_processes where script_name = ?';
    db.query(query,[name],function(err,row,fields){
        if(err){
            console.log(err);
        }
        if(row[0] !== undefined) {
            callback(row[0].pid);
        }
    });
}
module.exports.getPidOfProcess = getPidOfProcess;

function getRunningProcesses(callback){
    var query = 'select * from running_processes';
    db.query(query,function(err,rows,fields){
        if(err){console.log(err)}
        callback(rows);
    })
}
module.exports.getRunningProcesses = getRunningProcesses;

function truncateProcesses(){
    db.query("truncate running_processes",function(err,row,fields){});
}
module.exports.truncateProcesses = truncateProcesses;

/*keywords query's*/

function getKeywords(callback){
    var query = 'select * from keywords';
    doQueryAndCallbackData(query,callback);
}
module.exports.getKeywords = getKeywords;

function addKeyword(keyword){
    var query = "insert into keywords(keyword) select ? from dual where not exists(select keyword from keywords where keyword = ?);";
    db.query(query,[keyword,keyword],function(err,row,fields){if(err)console.log(err)});
}
module.exports.addKeyword = addKeyword;

function editKeyword(id,keyword){
    var query = "update keywords set keyword = ? where id = ?";
    db.query(query,[keyword,id],function(err,row,fields){if(err)console.log(err)});
}
module.exports.editKeyword = editKeyword;

function removeKeyword(id){
        query = "delete from keywords where id = ?";
        db.query(query,[id],function(err,row,fields){if(err)console.log(err);})
}
module.exports.removeKeyword = removeKeyword;

/*ignored sites query's*/

function getIgnoreList(callback){
    var query = 'select * from sites_to_ignore';
    doQueryAndCallbackData(query,callback);
}
module.exports.getIgnoreList = getIgnoreList;

function addIgnore(keyword){
    var query = "insert into sites_to_ignore(site) select ? from dual where not exists(select site from sites_to_ignore where site = ?);"
    db.query(query,[keyword,keyword],function(err,row,fields){
        if(err){console.log(err);}
    });
}
module.exports.addIgnore = addIgnore;

function editIgnore(id,keyword){
    var query = 'update sites_to_ignore set site = ? where id = ?';
    db.query(query,[keyword,id],function(err,row,fields){
       if(err){console.log(err);}
    });
}
module.exports.editIgnore = editIgnore;

function deleteIgnore(id){
    var query = 'delete from sites_to_ignore where id = ?';
    db.query(query,[id],function(err,row,fields){
        if(err){console.log(err);}
    });
}
module.exports.deleteIgnore = deleteIgnore;


