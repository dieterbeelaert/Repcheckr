/**
 * Created by dietn on 20/11/14.
 */

//global variables
var request = require("request");
var cheerio = require("cheerio");
var settings = require("./settings.json");
var dataHandler = require("./SQL/DataHandler");
var StatusChecker = require('./Classifier/StatusChecker.js');


console.log("let's to this");
//initiate mood checker
var mood = new StatusChecker();
//start extracting
extractData();

function extractData(){
    dataHandler.getSpideredLinks(function(rows){
        for(var i = 0; i < rows.length; i++) {
            //only request sites that aren't rated yet + ignore relative paths (they still sneak in :-( )
            if(rows[i].mood_score === null && rows[i].link.indexOf('/') !== 0) {
                doRequest(rows[i]);
            }
        }
    });
}

function doRequest(site){
    request(site.link,function(err,response,body){
        if(!err) {
            console.log('requesting site: ' + site.link);
            $ = cheerio.load(body);
            var bodyText = cleanupHtml($);
            dataHandler.insertBodyText(site.id, bodyText);
            //now we have the text let's add the mood for it
            var pageMood = mood.getPageMood(bodyText);
            dataHandler.setPageMood(site.id,pageMood);
        }
        else{
            //remove site from db
            console.log("error on fetching " + site.link);
        }
    }).setMaxListeners(20);
}

//TODO move this to a utils file
/*
* Removes whitespaces and newlines
* Also removes all the css and scripts from the string
 */
function cleanupHtml($){
    $('script').remove();
    $('style').remove();
    var txt = $('body').text();
    txt = txt.replace(/\n/gi,' ');
    txt = txt.replace(/  +|\t/gi,' ').trim();
    return txt;
}


function getBaseUrl(url){
    url.replace(".html","");
    var filtered = url.match(/http(s)?:\/\/(.+)\.(com|net|org|gov|int|edu|mil|arpa|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cs|cu|cv|cw|cx|cy|cz|dd|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zr|zw)/i);
    return filtered[0];
}