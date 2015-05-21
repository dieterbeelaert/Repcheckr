/**
 * Created by dietn on 18/12/14.
 */
var settings = require("../settings.json");
var Context = require("../Models/Context.js");
var Controller = require('../Controllers');


function routeRequest(req,res){
   var ctx = new Context(req);
   var controller = null;
   parsePath(req.path,function(routeObj){
       ctx.routeObj = routeObj;
       switch(routeObj.controller){
           case "stats": controller = new Controller.StatsController(req,res,ctx);
               break;
           case "spider": controller = new Controller.SpiderController(req,res,ctx);
               break;
           case "keyword": controller = new Controller.KeywordController(req,res,ctx);
               break;
           case "ignore": controller = new Controller.IgnoreController(req,res,ctx);
               break;
           case "product": controller = new Controller.ProductController(req,res,ctx);
               break;
           default: res.render(settings.indexPage);
               break;
       }
       if(controller != null){
           controller.doRequest();
       }else{
           res.end();
       }
    });
}
module.exports.routeRequest = routeRequest;


function parsePath(path,callback){
    var names = ["controller","action","id"];
    var splitted = path.split("/");
    var routeObj = {};
    for(var i = 1; i < splitted.length; i++){
        routeObj[names[i-1]] = splitted[i];
    }
    callback(routeObj)
}