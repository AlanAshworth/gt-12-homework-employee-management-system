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
          break;
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
            DeptID: `${res[i].department_id}`,
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
            ManagerID: `${res[i].manager_id}`,
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
            Name: `${res[i].name}`,
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
  inquirer
    .prompt({
      name: "add",
      type: "list",
      message: "Select a table to add data.",
      choices: ["Role", "Employee", "Department", "Go Back"],
    })
    .then(function (answer) {
      switch (answer.add) {
        case "Role":
          addRoleData();
          break;
        case "Employee":
          addEmployeeData();
          break;
        case "Department":
          addDepartmentData();
          break;
        case "Go Back":
          runDatabase();
        default:
          throw new Error("Invalid selection.");
      }
    });

  function addRoleData() {
    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Enter Title:",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "Enter Salary:",
        },
        {
          name: "roleDepartmentId",
          type: "input",
          message: "Enter Department ID:",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.roleTitle,
            salary: answer.roleSalary,
            department_id: answer.roleDepartmentId,
          },
          function (err) {
            if (err) throw err;
            console.log("New role has been entered.");
            runDatabase();
          }
        );
      });
  }

  function addEmployeeData() {
    inquirer
      .prompt([
        {
          name: "employeeFirstName",
          type: "input",
          message: "Enter first name:",
        },
        {
          name: "employeeLastName",
          type: "input",
          message: "Enter last name:",
        },
        {
          name: "employeeRoleId",
          type: "input",
          message: "Enter Role ID:",
        },
        {
          name: "employeeManagerId",
          type: "input",
          message: "Enter Manager ID:",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.employeeFirstName,
            last_name: answer.employeeLastName,
            role_id: answer.employeeRoleId,
            manager_id: answer.employeeManagerId,
          },
          function (err) {
            if (err) throw err;
            console.log("New employee has been entered.");
            runDatabase();
          }
        );
      });
  }

  function addDepartmentData() {
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "input",
          message: "Enter department name:",
        },
      ])
      .then(function (answer) {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.departmentName,
          },
          function (err) {
            if (err) throw err;
            console.log("New department has been entered.");
            runDatabase();
          }
        );
      });
  }
}

function updateTableData() {
  inquirer
    .prompt({
      name: "update",
      type: "list",
      message: "Select a table to update data.",
      choices: ["Department", "Go Back"],
    })
    .then(function (answer) {
      switch (answer.update) {
        case "Role":
          updateRoleData();
          break;
        case "Employee":
          updateEmployeeData();
          break;
        case "Department":
          updateDepartmentData();
          break;
        case "Go Back":
          runDatabase();
          break;
        default:
          throw new Error("Invalid selection.");
      }
    });

  function updateEmployeeData() {
    connection.query("SELECT * FROM employee", function (err, data) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employee",
            type: "list",
            message: "Select Employee to update.",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < data.length; i++) {
                choiceArray.push(
                  `${data[i].id}: ${data[i].first_name} ${data[i].last_name}`
                );
              }
              return choiceArray;
            },
          },
          {
            name: "newEmployeeFirstName",
            type: "input",
            message: "Edit Employee first name:",
          },
          {
            name: "newEmployeeLastName",
            type: "input",
            message: "Edit Employee last name:",
          },
          {
            name: "newEmployeeRoleID",
            type: "input",
            message: "Edit Employee Role ID:",
          },
          {
            name: "newEmployeeManagerID",
            type: "input",
            message: "Edit Employee Manager ID:",
          },
        ])
        .then(function (answer) {
          var chosenItem;
          for (let i = 0; i < data.length; i++) {
            if (data[i].id === answer.employee) {
              chosenItem = data[i];
            }
          }
          connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
              {
                first_name: answer.newEmployeeFirstName,
                last_name: answer.newEmployeeLastName,
                role_id: parseInt(answer.newEmployeeRoleID),
                manager_id: parseInt(answer.newEmployeeManagerID),
              },
              {
                id: chosenItem.id,
              },
            ],
            function (err) {
              if (err) throw err;
              console.log("Employee has been updated.");
              runDatabase();
            }
          );
        });
    });
  }

  function updateDepartmentData() {
    connection.query("SELECT * FROM department", function (err, data) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "department",
            type: "list",
            message: "Select Department to update.",
            choices: function () {
              let choiceArray = [];
              for (let i = 0; i < data.length; i++) {
                choiceArray.push(data[i].name);
              }
              return choiceArray;
            },
          },
          {
            name: "newDepartment",
            type: "input",
            message: "Edit Department:",
          },
        ])
        .then(function (answer) {
          var chosenItem;
          for (let i = 0; i < data.length; i++) {
            if (data[i].name === answer.department) {
              chosenItem = data[i];
            }
          }
          connection.query(
            "UPDATE department SET ? WHERE ?",
            [
              {
                name: answer.newDepartment,
              },
              {
                id: chosenItem.id,
              },
            ],
            function (err) {
              if (err) throw err;
              console.log("Department has been updated.");
              runDatabase();
            }
          );
        });
    });
  }
}

function quit() {
  console.log("Exiting Employee Tracker.");
  connection.end();
}
