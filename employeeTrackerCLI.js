var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host:"localhost",
    port:3306,
    user: "root",
    password:"root",
    database:"employee_tracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    searchDatabase();
});

function searchDatabase() {
    
}