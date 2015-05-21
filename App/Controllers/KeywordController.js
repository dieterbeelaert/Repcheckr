
/**
 * Created by dietn on 19/12/14.
 */
var Controller = require('./Controller.js');
var db = require("../Data/DataHandler.js");


/*Constructor*/
function KeywordController(req,res,ctx){
    console.log("init keywordcontroller");
    this.prototype = new Controller(req,res,ctx);
}
module.exports = KeywordController;

KeywordController.prototype.doRequest = function(){
    var self = this;
    self.prototype.setResJSON(); //this controller always returns JSON
    console.log(self.prototype.ctx.routeObj);
    switch(self.prototype.ctx.routeObj.action){
        case "get": self.getAll();
            break;
        case "add": self.addKeyword();
            break;
        case "edit": self.editKeyword();
            break;
        case "delete": self.deleteKeyword();
            break;
        default: self.prototype.res.end();
            break;
    }
}

KeywordController.prototype.getAll = function(){
    var self = this;
    db.getKeywords(function(json){
        self.prototype.returnJSON(json);
    });
}

KeywordController.prototype.addKeyword = function(){
    var self = this;
    var keyword = self.prototype.ctx.getParam("keyword");
    db.addKeyword(keyword);
    self.prototype.res.end();
}

KeywordController.prototype.editKeyword = function(){
    var self = this;
    var id = self.prototype.ctx.getParam("id");
    var keyword = self.prototype.ctx.getParam("keyword");
    db.editKeyword(id,keyword);
    self.prototype.res.end();
}

KeywordController.prototype.deleteKeyword = function(){
    var self = this;
    var id = self.prototype.ctx.routeObj.id;
    db.removeKeyword(id);
    self.prototype.res.end();
}
