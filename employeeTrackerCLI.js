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
    runDatabase();
});

function runDatabase() {
    inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Welcome to Employee Tracker. Select an action.",
      choices: [
        "View Table data",
        "Add Table Data",
        "Update Table Data"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "View Table Data":
        viewTableData();
        break;
      case "Add Table Data":
        addTableData();
        break;
      case "Update Table Data":
        updateTableData();
        break;
      default:
        proceedDirection();
      }
    });
}

function viewTableData(params) {
    console.log("Proceeding to View Table Data menu.");
}

function addTableData(params) {
    console.log("Proceeding to Add Table Data menu.");
}

function updateTableData(params) {
    console.log("Proceeding to Update Table Data menu.");
}

function proceedDirection(params) {
    inquirer
    .prompt({
      name: "proceed",
      type: "list",
      message: "Retry or Quit?",
      choices: [
        "Retry",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.proceed) {
      case "Retry":
        retry();
        break;
      case "Quit":
        quit();
        break;
      default:
        throw new Error("Invalid selection.");
      }
    });
}

function retry() {
    runDatabase();
}

function quit(params) {
    console.log("Exiting Employee Tracker.");
    break;
}