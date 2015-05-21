/**
 * Created by dietn on 02/01/15.
 */
var Controller = require('./Controller.js');
var db = require("../Data/DataHandler.js");


/*Constructor*/
function IgnoreController(req,res,ctx){
    this.prototype = new Controller(req,res,ctx);
}
module.exports = IgnoreController;

IgnoreController.prototype.doRequest = function(){
    var self = this;
    self.prototype.setResJSON(); //this controller always returns JSON
    console.log(self.prototype.ctx.routeObj);
    switch(self.prototype.ctx.routeObj.action){
        case "get": self.getAll();
            break;
        case "add": self.add();
            break;
        case "edit": self.edit();
            break;
        case "delete": self.delete();
            break;
        default: self.prototype.res.end();
            break;
    }
}

IgnoreController.prototype.getAll = function(){
    var self = this;
    db.getIgnoreList(function(rows){
        self.prototype.res.write(JSON.stringify(rows));
        self.prototype.res.end();
    });
}

IgnoreController.prototype.add = function(){
    var self = this;
    db.addIgnore(self.prototype.ctx.routeObj.id);
    self.prototype.res.end();
}

IgnoreController.prototype.edit = function(){
    var self = this;
    var keyword = self.prototype.ctx.getParam('keyword');
    var id = self.prototype.ctx.routeObj.id;
    db.editIgnore(id,keyword);
    self.prototype.res.end();
}

IgnoreController.prototype.delete = function(){
    db.deleteIgnore(this.prototype.ctx.routeObj.id);
    this.prototype.res.end();
}
