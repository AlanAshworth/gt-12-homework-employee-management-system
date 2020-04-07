const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runDatabase();
});

function runDatabase() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "Select an action for your data.",
      choices: ["View", "Add", "Update", "Quit"],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View":
          viewTableData();
          break;
        case "Add":
          addTableData();
          break;
        case "Update":
          updateTableData();
          break;
        case "Quit":
          quit();
          break;
        default:
          throw new Error("Invalid selection.");
      }
    });
}

function viewTableData() {
  inquirer
    .prompt({
      name: "view",
      type: "list",
      message: "Select a table to view data.",
      choices: ["Role", "Employee", "Department", "Go Back"],
    })
    .then(function (answer) {
      switch (answer.view) {
        case "Role":
          viewRoleTable();
          break;
        case "Employee":
          viewEmployeeTable();
          break;
        case "Department":
          viewDepartmentTable();
          break;
        case "Go Back":
          runDatabase();
        default:
          throw new Error("Invalid selection.");
      }
    });

  function viewRoleTable() {
    var query = "SELECT * FROM role;";
    connection.query(query, function (err, res) {
      if (err) {
        throw err;
      } else {
        let roles = [];
        for (let i = 0; i < res.length; i++) {
          let element = {
            ID: `${res[i].id}`,
            Title: `${res[i].title}`,
            Salary: `${res[i].salary}`,
            DeptID: `${res[i].department_id}`
          };
          roles.push(element);
        }
        console.table(roles);
        roles.length = 0;
      }
      runDatabase();
    });
  }

  function viewEmployeeTable() {
    var query = "SELECT * FROM employee;";
    connection.query(query, function (err, res) {
      if (err) {
        throw err;
      } else {
        let employees = [];
        for (let i = 0; i < res.length; i++) {
          let element = {
            ID: `${res[i].id}`,
            FirstName: `${res[i].first_name}`,
            LastName: `${res[i].last_name}`,
            RoleID: `${res[i].role_id}`,
            ManagerID: `${res[i].manager_id}`
          };
          employees.push(element);
        }
        console.table(employees);
        employees.length = 0;
      }
      runDatabase();
    });
  }

  function viewDepartmentTable() {
    var query = "SELECT * FROM department;";
    connection.query(query, function (err, res) {
      if (err) {
        throw err;
      } else {
        let departments = [];
        for (let i = 0; i < res.length; i++) {
          let element = {
            ID: `${res[i].id}`,
            Name: `${res[i].name}`
          };
          departments.push(element);
        }
        console.table(departments);
        departments.length = 0;
      }
      runDatabase();
    });
  }
}

function addTableData() {
  console.log("Proceeding to Add Table Data menu.");
}

function updateTableData() {
  console.log("Proceeding to Update Table Data menu.");
}

function quit() {
  console.log("Exiting Employee Tracker.");
  connection.end();
}
