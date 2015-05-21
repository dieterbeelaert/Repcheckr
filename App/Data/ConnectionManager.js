/**
 * Created by dietn on 28/11/14.
 */
var mysql = require("mysql");
var settings = require("../settings.json");
function getConnection(){
    var db =  mysql.createConnection({
        host     : settings.dbHost,
        user     : settings.dbUser,
        password : settings.dbPwd,
        database: settings.dbName
    });
    db.connect();
    return db;
}
module.exports.getConnection = getConnection;