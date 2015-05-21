/**
 * Created with JetBrains WebStorm.
 * User: Dieter Beelaert
 * Date: 16/03/14
 * Time: 20:19
 * To change this template use File | Settings | File Templates.
 */
var DataHandler = require('../Data/DataHandler.js');


function Controller(req,res,ctx){
    this.req = req;
    this.res = res;
    this.ctx = ctx;
    this.db = DataHandler;
}

/*Needs to be overriden based on the action taht the controller is instantiated ....*/
Controller.prototype.needsLogin = function(){
    return false;
}

Controller.prototype.renderPage = function(view){
    this.res.render(view,this.ctx);
}

Controller.prototype.setResJSON = function(){
    this.res.contentType('text/JSON');
}

Controller.prototype.returnJSON = function(json){
    var self = this;
    self.res.write(JSON.stringify(json));
    self.res.end();
}
module.exports = Controller;