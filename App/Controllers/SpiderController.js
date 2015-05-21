
/**
 * Created by dietn on 19/12/14.
 */
var Controller = require('./Controller.js');
var exec = require('child_process').exec;
var db = require('../Data/DataHandler.js');
var psTree = require('ps-tree');


/*Constructor*/
function SpiderController(req,res,ctx){
    console.log("init spidercontroller");
    this.prototype = new Controller(req,res,ctx);
}
module.exports = SpiderController;

SpiderController.prototype.doRequest = function(){
    var self = this;
    self.prototype.setResJSON(); //this controller always returns JSON
    console.log(self.prototype.ctx.routeObj);
    switch(self.prototype.ctx.routeObj.action){
        case "searchbot": self.doBot('search');
            break
        case "extractorbot": self.doBot('extract')
            break;
        case "stats": self.getStats();
            break;
        default: self.prototype.res.end();
            break;
    }
}

SpiderController.prototype.doBot = function(scriptName){
    var self = this;
    self.prototype.res.write('{"status":"ok"}');
    self.prototype.res.end();
    //check what to do by id
    if(self.prototype.ctx.routeObj.id === "start"){
        var command = 'node ./spider/' + scriptName + '.js';
        var process = exec(command);
        db.insertProcess(process.pid,scriptName)
        process.stdout.on('data', function (data) {
            console.log(process.pid + " stdout: " + data);
        });
        process.on("close", function (code) {
            console.log("closed with code: " + code);
            db.removeProcess(process.pid,scriptName);
        });
    } else {
        db.getPidOfProcess(scriptName,function(pid){
            kill(pid);
            db.removeProcess(pid,scriptName);
        });
    }
}

SpiderController.prototype.getStats = function(){
    var self = this;
    db.getRunningProcesses(function(json){
        self.prototype.returnJSON(json);
    });
}


var kill = function (pid, signal, callback) {
    signal   = signal || 'SIGKILL';
    callback = callback || function () {};
    var killTree = true;
    if(killTree) {
        psTree(pid, function (err, children) {
            [pid].concat(
                children.map(function (p) {
                    return p.PID;
                })
            ).forEach(function (tpid) {
                    try { process.kill(tpid, signal) }
                    catch (ex) { }
                });
            callback();
        });
    } else {
        try { process.kill(pid, signal) }
        catch (ex) { }
        callback();
    }
};

