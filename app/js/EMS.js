const chalk = require("chalk");
const inquirer = require("inquirer");
const cTable = require("console.table");
const connection = require("../config/connection");

const EMS = () => {
  const Action = {
    CREATE: {
      EMPLOYEE: "Add Employee",
      DEPARTMENT: "Add Department",
      ROLE: "Add Role",
      MANAGER: "Add Manager",
      toString: () => {
        return "Add (Employee, Dept, Manager, Role)";
      },
    },
    READ: {
      EMPLOYEE: {
        ALL: "View Employees",
        BY_MANAGER: "View Employees by Manager",
        BY_DEPARTMENT: "View Employees by Department",
        BY_ROLE: "View Employees by Role",
      },
      DEPARTMENT: {
        ALL: "View Departments",
      },
      ROLE: {
        ALL: "View Roles",
        BY_DEPARTMENT: "View Roles by Department",
      },
      MANAGER: {
        ALL: "View Managers",
      },
      toString: () => {
        return "View (Employee, Dept, Manager, Role)";
      },
    },
    UPDATE: {
      EMPLOYEE: "Edit Employee",
      DEPARTMENT: "Edit Department",
      ROLE: "Edit Role",
      MANAGER: "Edit Manager",
      toString: () => {
        return "Update (Employee, Dept, Manager, Role)";
      },
    },
    DELETE: {
      EMPLOYEE: "Remove Employee",
      DEPARTMENT: "Remove Department",
      ROLE: "Remove Role",
      MANAGER: "Remove Manager",
      toString: () => {
        return "Remove (Employee, Dept, Manager, Role)";
      },
    },
    QUIT: "Quit",
    toString: () => {
      return "Actions";
    },
  };
  Object.freeze(Action);

  const currencyFormat = (num) => {
    return "$" + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const createInquiry = () => {
    return inquirer.prompt([
      {
        name: "action",
        type: "list",
        choices: [
          Action.CREATE.EMPLOYEE,
          Action.CREATE.DEPARTMENT,
          Action.CREATE.MANAGER,
          Action.CREATE.ROLE,
        ],
      },
    ]);
  };

  const readInquiry = () => {
    return inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Choose an action:",
        choices: [
          Action.READ.EMPLOYEE.ALL,
          Action.READ.EMPLOYEE.BY_MANAGER,
          Action.READ.EMPLOYEE.BY_DEPARTMENT,
          Action.READ.EMPLOYEE.BY_ROLE,
          Action.READ.DEPARTMENT.ALL,
          Action.READ.MANAGER.ALL,
          Action.READ.ROLE.ALL,
          Action.READ.ROLE.BY_DEPARTMENT,
        ],
      },
    ]);
  };

  const updateInquiry = () => {
    return inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Choose an action:",
        choices: [
          Action.UPDATE.EMPLOYEE,
          Action.UPDATE.DEPARTMENT,
          Action.UPDATE.ROLE,
          Action.UPDATE.MANAGER,
        ],
      },
    ]);
  };

  const deleteInquiry = () => {
    return inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Choose an action:",
        choices: [
          Action.DELETE.EMPLOYEE,
          Action.DELETE.DEPARTMENT,
          Action.DELETE.ROLE,
          Action.DELETE.MANAGER,
        ],
      },
    ]);
  };

  const operationInquiry = () => {
    return inquirer.prompt([
      {
        name: "operation",
        type: "list",
        message: "What would you like to do?",
        choices: [
          Action.CREATE.toString(),
          Action.READ.toString(),
          Action.UPDATE.toString(),
          Action.DELETE.toString(),
          Action.QUIT,
        ],
      },
    ]);
  };

  const fitsCharLength = (val) =>
    val.length <= 30 || "Must be 30 characters or less";

  const createEmployee = async (isManager) => {
    await readAllEmployees();
    let roles = await connection.query(
      `select title as name, id as value from role`
    );
    if (roles.length === 0) {
      console.log(chalk.red("You must create a Role first."));
      return;
    }
    roles.push({
      name: "None",
      value: null,
    });
    let managers = await connection.query(
      `select concat(first_name, ' ', last_name) as name, id as value from employee`
    );
    managers.push({
      name: "None",
      value: null,
    });
    // console.log(roles);
    let answers = await inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "First name:",
        validate: fitsCharLength,
      },
      {
        name: "last_name",
        type: "input",
        message: "Last name:",
        validate: fitsCharLength,
      },
      {
        name: "role_id",
        type: "list",
        message: "Choose role:",
        choices: roles,
      },
      {
        name: "manager_id",
        type: "list",
        message: "Choose a Manager:",
        choices: managers,
        when: !isManager,
      },
    ]);
    let res = await connection.query(`insert into employee set ?`, answers);

    if (isManager) {
      let insertId = res.insertId;
      employees = await connection.query(
        `select CONCAT(first_name, ' ', last_name) as name, id as value from employee
            where id <> ?`,
        [insertId]
      );
      if (employees.length < 1) {
        console.log(chalk.red("There are no employees to manage."));
        return;
      }
      let ans = await inquirer.prompt([
        {
          name: "manage",
          type: "checkbox",
          message: "Whom should they manage?",
          choices: employees,
          validate: (answer) =>
            answer.length >= 1 ||
            "You must select at least one employee to manage.",
        },
      ]);
      // console.log(ans);
      await connection.query(
        `UPDATE employee set manager_id = ${insertId} where id in (${ans.manage.join(
          ","
        )})`
      );
      await readManagers();
      console.log(chalk.green("Manager created"));
    } else {
      await readAllEmployees();
      console.log(
        chalk.green(
          `Inserted Employee: ${answers.first_name} ${answers.last_name}`
        )
      );
    }
  };

  const createDepartment = async () => {
    await readDepartments();
    let answers = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        validate: fitsCharLength,
        message: "Department name:",
      },
    ]);
    let res = await connection.query(`insert into department set ?`, answers);
    await readDepartments();
    console.log(`Inserted Department: ${answers.name}`);
  };

  const createRole = async () => {
    await readRoles();
    let departments = await connection.query(
      `SELECT name, id as value FROM department`
    );
    if (departments.length === 0) {
      console.log(chalk.red("You must create a Department first."));
      return;
    }
    let answers = await inquirer.prompt([
      {
        name: "department_id",
        type: "list",
        message: "Choose a Department:",
        choices: departments,
      },
      {
        name: "title",
        type: "input",
        validate: fitsCharLength,
        message: "Role title:",
      },
      {
        name: "salary",
        type: "input",
        message: "Salary $:",
        validate: (val) =>
          /^\$?([\d,]+(?:\.\d{2})?)$/.test(val) || "Enter a valid salary",
        filter: (val) => parseFloat(val.match(/[\d\.]+/g).join("")),
      },
    ]);
    await connection.query(`insert into role set ?`, answers);
    await readRoles();
    console.log(`Inserted Role: ${answers.title}`);
  };

  const readAllEmployees = async () => {
    var result = await connection.query(
      `select e.Id, concat(e.first_name, ' ', e.last_name) as Name, r.title as Role, d.name as Department, concat('$',format(r.salary, 2)) as Salary, concat(m.first_name, ' ', m.last_name) as Manager
        from employee e
        left join employee m on e.manager_id = m.id
        left join role r on e.role_id = r.id
        left join department d on r.department_id = d.id`
    );
    // console.clear();
    console.table(result);
  };

  const readEmployeesByManager = async () => {
    var managers = await connection.query(
      `select distinct e.manager_id as value, concat(m.first_name, ' ', m.last_name) as name 
        from employee e
        inner join employee m on m.id = e.manager_id`
    );
    if (managers.length === 0) {
      console.log("No Managers. Add a Manager");
      return;
    }
    var answers = await inquirer.prompt([
      {
        name: "manager_id",
        type: "list",
        message: "Choose a Manager",
        choices: managers,
      },
    ]);
    var result = await connection.query(
      `select e.Id, concat(e.first_name, ' ', e.last_name) as Name, r.title as Role, d.name as Department, concat('$',format(r.salary, 2)) as Salary, concat(m.first_name, ' ', m.last_name) as Manager
        from employee e
        left join employee m on e.manager_id = m.id
        left join role r on e.role_id = r.id
        left join department d on d.id = r.department_id
        where e.manager_id = ?`,
      [answers.manager_id]
    );
    console.table(result);
  };

  const readEmployeesByDepartment = async () => {
    var departments = await connection.query(
      `select name, id as value from department`
    );
    if (departments.length === 0) {
      console.log("No Departments. Add a Department");
      return;
    }
    var answers = await inquirer.prompt([
      {
        name: "department_id",
        type: "list",
        message: "Choose a Department:",
        choices: departments,
      },
    ]);
    var result = await connection.query(
      `select e.Id, concat(e.first_name, ' ', e.last_name) as Name, r.title as Role, d.name as Department, concat('$',format(r.salary, 2)) as Salary, concat(m.first_name, ' ', m.last_name) as Manager
        from employee e
        left join employee m on e.manager_id = m.id
        left join role r on e.role_id = r.id
        left join department d on d.id = r.department_id
        where d.id = ?`,
      [answers.department_id]
    );
    console.table(result);
  };

  const readEmployeesByRole = async () => {
    var roles = await connection.query(
      `select r.id as value, r.title as name from role r`
    );
    if (roles.length === 0) {
      console.log("No Roles. Add a Role first.");
      return;
    }
    var answers = await inquirer.prompt([
      {
        name: "role_id",
        type: "list",
        message: "Choose a Role",
        choices: roles,
      },
    ]);
    var result = await connection.query(
      `select e.Id, concat(e.first_name, ' ', e.last_name) as Name, r.Title, d.name as Department, concat('$',format(r.salary, 2)) as Salary, concat(m.first_name, ' ', m.last_name) as Manager
        from employee e
        left join employee m on e.manager_id = m.id
        left join role r on e.role_id = r.id
        left join department d on d.id = r.department_id
        where e.role_id = ?`,
      [answers.role_id]
    );
    console.table(result);
  };

  const readDepartments = async () => {
    let result = await connection.query(
      `select Id, name as Department from department`
    );
    console.table(result);
  };

  const readRoles = async () => {
    let result = await connection.query(
      `select r.Id, r.title as Role, concat('$',format(r.Salary,2)) as Salary, d.name as Department from role r
        left join department d
        on r.department_id = d.id`
    );
    console.table(result);
  };

  const readRolesByDepartment = async () => {
    let departments = await connection.query(
      `select d.id as value, d.name from department d`
    );
    let answer = await inquirer.prompt([
      {
        name: "department_id",
        type: "list",
        message: "Choose a Department:",
        choices: departments,
      },
    ]);
    let result = await connection.query(
      `select r.Id, r.title as Role, concat('$',format(r.salary,2)) as Salary, d.name as Department
        from role r
        left join department d
        on r.department_id = d.id
        where r.department_id = ?`,
      [answer.department_id]
    );
    console.table(result);
  };

  const readManagers = async () => {
    let result = await connection.query(
      `select distinct e.manager_id as Id, concat(m.first_name, ' ', m.last_name) as Name, r.title as Role, d.name as Department, concat('$',format(r.salary, 2)) as Salary, concat(m2.first_name, ' ', m2.last_name) as Manager
        from employee e
        inner join employee m on m.id = e.manager_id
        left join role r on r.id = m.role_id
        left join department d on d.id = r.department_id
        left join employee m2 on m.manager_id = m2.id`
    );
    console.table(result);
  };

  const updateEmployee = async (isManager) => {
    if (isManager) {
      await readManagers();
    } else {
      await readAllEmployees();
    }
    let roles = await connection.query(
      `select title as name, id as value from role`
    );
    let employees;
    if (isManager) {
      employees = await connection.query(
        `select distinct e.manager_id as value, concat(m.first_name, ' ', m.last_name) as name
            from employee e
            inner join employee m on m.id = e.manager_id`
      );
    } else {
      employees = await connection.query(
        `select id as value, concat(first_name, ' ', last_name) as name
            from employee`
      );
    }
    if (employees.length === 0) {
      console.log(chalk.red("No Employees/Managers. Add an Employee."));
      return;
    }
    let managers = await connection.query(
      `select concat(first_name, ' ', last_name) as name, id as value from employee`
    );
    managers.push({
      name: "None",
      value: null,
    });

    let answer = await inquirer.prompt([
      {
        name: "employee_id",
        type: "list",
        message: `Pick a${isManager ? " manager:" : "n employee:"}`,
        choices: employees,
      },
    ]);
    let employee = await connection.query(
      `select e.first_name, e.last_name, e.Id, e.role_id, e.manager_id, concat(e.first_name, ' ', e.last_name) as Name, r.title as Role, d.name as Department, concat(m.first_name, ' ', m.last_name) as Manager
        from employee e
        left join employee m on e.manager_id = m.id
        left join role r on e.role_id = r.id
        left join department d on d.id = r.department_id
        where e.id = ?`,
      [answer.employee_id]
    );
    employee = employee[0];

    let answers = await inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "First name:",
        validate: fitsCharLength,
        default: employee.first_name,
      },
      {
        name: "last_name",
        type: "input",
        message: "Last name:",
        validate: fitsCharLength,
        default: employee.last_name,
      },
      {
        name: "role_id",
        type: "list",
        message: "Choose role:",
        choices: roles,
        default: roles.findIndex((x) => x.value === employee.role_id),
      },
      {
        name: "manager_id",
        type: "list",
        message: "Choose a Manager:",
        choices: managers.filter((x) => x.value !== employee.Id),
        default: managers
          .filter((x) => x.value !== employee.Id)
          .findIndex((x) => x.value === employee.manager_id),
      },
    ]);
    // console.log(answers);
    await connection.query(
      `update employee set ? where id = ${answer.employee_id}`,
      answers
    );
    if (isManager) {
      employees = await connection.query(
        `select CONCAT(first_name, ' ', last_name) as name, id as value, if(manager_id = ? ,true, false) as checked from employee
            where id <> ? and id <> ?`,
        [answer.employee_id, answer.employee_id, answers.manager_id || 0]
      );
      let ans = await inquirer.prompt([
        {
          name: "manage",
          type: "checkbox",
          message: "Whom should they manage?",
          choices: employees,
          validate: (answer) =>
            answer.length >= 1 ||
            "You must select at least one employee to manage.",
        },
      ]);
      console.log(ans);
      await connection.query(
        `UPDATE employee set manager_id = ${
          answer.employee_id
        } where id in (${ans.manage.join(",")})`
      );
      await connection.query(
        `UPDATE employee set manager_id = null
            where manager_id = ${answer.employee_id}
            and id not in (${ans.manage.join(",")})`
      );
      await readManagers();
      console.log(chalk.green("Manager updated"));
    } else {
      await readAllEmployees();
      console.log(
        chalk.green(
          `Updated employee: ${answers.first_name} ${answers.last_name}`
        )
      );
    }
  };

  const updateDepartment = async () => {
    await readDepartments();
    let departments = await connection.query(
      `select d.name, d.id as value from department d`
    );
    if (departments.length === 0) {
      console.log(chalk.red("No Departments. Add a Department"));
      return;
    }
    let answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Choose a department:",
        choices: departments,
      },
    ]);
    let department = await connection.query(
      `select id, name from department where id = ?`,
      [answer.id]
    );
    department = department[0];
    let answers = await inquirer.prompt([
      {
        name: "name",
        type: "input",
        validate: fitsCharLength,
        message: "Update Deparment name:",
        default: department.name,
      },
    ]);
    await connection.query(
      `update department set ? where id = ${answer.id}`,
      answers
    );
    await readDepartments();
    console.log(chalk.green("Department Updated"));
  };

  const updateRole = async () => {
    await readRoles();
    let roles = await connection.query(
      `select id as value, title as name from role`
    );
    let departments = await connection.query(
      `select id as value, name from department`
    );
    if (roles.length === 0) {
      console.log(chalk.red("No Roles. Add a Role."));
      return;
    }
    let answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Chose a role to edit:",
        choices: roles,
      },
    ]);
    let role = await connection.query(
      `select id, title, salary, department_id from role
        where id = ?`,
      [answer.id]
    );
    role = role[0];
    let answers = await inquirer.prompt([
      {
        name: "department_id",
        type: "list",
        message: "Choose a Department for this Role:",
        choices: departments,
      },
      {
        name: "title",
        type: "input",
        validate: fitsCharLength,
        message: "Edit Role title:",
        default: role.title,
      },
      {
        name: "salary",
        type: "input",
        message: "Salary $:",
        validate: (val) =>
          /^\$?([\d,]+(?:\.\d{2})?)$/.test(val) || "Enter a valid salary",
        filter: (val) => parseFloat(val.match(/[\d\.]+/g).join("")),
        default: currencyFormat(role.salary),
      },
    ]);
    await connection.query(`update role set ? where id = ${role.id}`, answers);
    await readRoles();
    console.log(chalk.green("Role updated"));
  };

  const deleteEmployee = async () => {
    await readAllEmployees();
    let employees = await connection.query(
      `select concat(first_name, ' ', last_name) as name, id as value from employee`
    );
    var answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Select an employee to remove:",
        choices: employees,
      },
    ]);
    await connection.query(`delete from employee where id = ?`, [answer.id]);
    await readAllEmployees();
    console.log(chalk.yellow(`Deleted employee`));
  };

  const deleteDepartment = async () => {
    await readDepartments();
    let departments = await connection.query(
      `select id as value, name from department`
    );
    if (departments.length === 0) {
      console.log(chalk.red("No Departments. Add a Department."));
      return;
    }
    let answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Choose a department to remove:",
        choices: departments,
      },
    ]);
    await connection.query(`delete from department where id = ?`, [answer.id]);
    await readDepartments();
    console.log(chalk.yellow("Deleted department"));
  };

  const deleteRole = async () => {
    await readRoles();
    let roles = await connection.query(
      `select id as value, title as name from role`
    );
    if (roles.length === 0) {
      console.log(chalk.red("No Roles. Add some roles."));
      return;
    }
    let answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Select role to remove:",
        choices: roles,
      },
    ]);
    await connection.query(`delete from role where id = ?`, [answer.id]);
    await readRoles();
    console.log(chalk.yellow("Role removed."));
  };

  const deleteManager = async () => {
    await readManagers();
    let managers = await connection.query(
      `select distinct e.manager_id as value, concat(m.first_name, ' ', m.last_name) as name
        from employee e
        inner join employee m on m.id = e.manager_id`
    );
    if (managers.length === 0) {
      console.log(chalk.red("No Managers. Add a manager."));
      return;
    }
    let answer = await inquirer.prompt([
      {
        name: "id",
        type: "list",
        message: "Select a manager to remove:",
        choices: managers,
      },
    ]);
    await connection.query(`delete from employee where id = ?`, [answer.id]);
    await readManagers();
    console.log(chalk.yellow("Manger removed."));
  };

  async function main() {
    mainloop: while (true) {
      const { operation } = await operationInquiry();
      let action;
      switch (operation) {
        case Action.CREATE.toString():
          action = await createInquiry();
          break;
        case Action.READ.toString():
          action = await readInquiry();
          break;
        case Action.UPDATE.toString():
          action = await updateInquiry();
          break;
        case Action.DELETE.toString():
          action = await deleteInquiry();
          break;
        case Action.QUIT:
          console.log(chalk.cyan("Goodbye"));
          quit();
          break mainloop;
          return;
          break;
        default:
          console.log(chalk.red("Invalid Action"));
          quit();
          break mainloop;
          return;
          break;
      }
      // console.log(action);
      switch (action.action) {
        case Action.CREATE.EMPLOYEE:
          await createEmployee();
          break;
        case Action.CREATE.DEPARTMENT:
          await createDepartment();
          break;
        case Action.CREATE.ROLE:
          await createRole();
          break;
        case Action.CREATE.MANAGER:
          await createEmployee("Manager");
          break;
        case Action.READ.EMPLOYEE.ALL:
          await readAllEmployees();
          break;
        case Action.READ.EMPLOYEE.BY_MANAGER:
          await readEmployeesByManager();
          break;
        case Action.READ.EMPLOYEE.BY_DEPARTMENT:
          await readEmployeesByDepartment();
          break;
        case Action.READ.EMPLOYEE.BY_ROLE:
          await readEmployeesByRole();
          break;
        case Action.READ.DEPARTMENT.ALL:
          await readDepartments();
          break;
        case Action.READ.ROLE.ALL:
          await readRoles();
          break;
        case Action.READ.ROLE.BY_DEPARTMENT:
          await readRolesByDepartment();
          break;
        case Action.READ.MANAGER.ALL:
          await readManagers();
          break;
        case Action.UPDATE.EMPLOYEE:
          await updateEmployee();
          break;
        case Action.UPDATE.DEPARTMENT:
          await updateDepartment();
          break;
        case Action.UPDATE.ROLE:
          await updateRole();
          break;
        case Action.UPDATE.MANAGER:
          await updateEmployee(true);
          break;
        case Action.DELETE.EMPLOYEE:
          await deleteEmployee();
          break;
        case Action.DELETE.DEPARTMENT:
          await deleteDepartment();
          break;
        case Action.DELETE.ROLE:
          await deleteRole();
          break;
        case Action.DELETE.MANAGER:
          await deleteManager();
          break;
        default:
          await quit();
          console.log(chalk.magenta("Goodbye"));

          break mainloop;
          break;
      }
    }
  }

  const quit = () => {
    return connection.close();
  };
};

module.exports = EMS;
