/**
 * Created by dietn on 18/12/14.
 */

var express = require('express');
var server = new express();
var settings = require("./settings.json");
var route = require('./Routing/RouteHandler.js');
var db = require('./Data/DataHandler.js');
//serve static files
server.use("/Public", express.static(__dirname + '/Public'));
db.truncateProcesses();



server.all('*',function(req,res){
    route.routeRequest(req,res);
});

server.listen(settings.port);
