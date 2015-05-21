/**
 * Created by dietn on 17/04/15.
 */
var Controller = require('./Controller.js');
var db = require("../Data/DataHandler.js");


/*Constructor*/
function ProductController(req,res,ctx){
    this.prototype = new Controller(req,res,ctx);
}
module.exports = ProductController;

ProductController.prototype.doRequest = function(){
    var self = this;
    self.prototype.setResJSON(); //this controller always returns JSON
    console.log(self.prototype.ctx.routeObj);
    switch(self.prototype.ctx.routeObj.action){
        case "add": self.add();
            break;
        case "edit": self.edit();
            break;
        case "delete": self.delete();
            break;
        case "get":
        default: self.getAll();
            break;
    }
}

ProductController.prototype.getAll = function(){
    var self = this;
    db.getProducts(function(products){
        self.prototype.res.write(JSON.stringify(products));
        self.prototype.res.end();
    });
}

ProductController.prototype.add = function(){
    var self = this;
    //TODO IMPLEMENT
}

ProductController.prototype.edit = function(){
    //TODO IMPLEMENT
}

ProductController.prototype.delete = function(){
    //TODO IMPLEMENT
}
