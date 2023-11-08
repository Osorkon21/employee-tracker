const inquirer = require("inquirer");
const art = require("ascii-art");
const { printTable } = require("console-table-printer");

function directFromMainMenu(response, db) {
  switch (response.choice) {
    case 0:
      viewAllEmployees(db);
      return;
    case 3:
      viewAllRoles(db);
      return;
    case 4:
      addRole(db);
      return;
    case 5:
      viewAllDepartments(db);
      return;
    case 6:
      addDepartment(db);
      return;
    case 7:
      goodbye();
  }
}

function mainMenu(db) {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          {
            name: "View All Employees",
            value: 0
          },
          {
            name: "Add Employee",
            value: 1
          },
          {
            name: "Update Employee Role",
            value: 2
          },
          {
            name: "View All Roles",
            value: 3
          },
          {
            name: "Add Role",
            value: 4
          },
          {
            name: "View All Departments",
            value: 5
          },
          {
            name: "Add Department",
            value: 6
          },
          {
            name: "Quit",
            value: 7
          }
        ]
      }
    ])
    .then((response) => {
      directFromMainMenu(response, db);
    });
}

function viewAllEmployees(db) {
  db.promise()
    .query('SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name) manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function viewAllRoles(db) {
  db.promise()
    .query('SELECT role.id, title, department.name department, salary FROM role JOIN department ON role.department_id = department.id;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function addRole(db) {
  var role;
  var departments;

  db.query("SELECT title FROM role", (err, data) => role = data);

  db.query("SELECT * FROM department;", (err, data) => {

    // fix this it's spitting out undefined
    departments = data.map((obj) => {
      obj = { name: obj.name, value: obj.id };
    });

    console.log(departments);
  });

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role?",
        name: "newTitle",
        validate: (newTitle) => {
          if (!newTitle)
            return "Role must have a title.";

          for (var i = 0; i < role.length; i++) {
            if (role[i].title.toLowerCase() === newTitle.toLowerCase())
              return "Role title already exists. Use a different title.";
          }

          return true;
        }
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "newSalary",
        validate: (newSalary) => {
          if (isNaN(newSalary))
            return "You must enter a number.";
          else
            return true;
        }
      },
      {
        type: "list",
        message: "Which department does the role belong to?",
        name: "department_id",
        choices: departments
      }
    ])
    .then((response) => {
      console.log(`\nAdded new ${response.newTitle} role.\n`);

      db.query("INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?);", [response.newTitle, response.department_id, response.newSalary], (err, data) => {
        mainMenu(db);
      });
    });
}

function viewAllDepartments(db) {
  db.promise()
    .query('SELECT * FROM department;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function addDepartment(db) {
  var department;

  db.query(`SELECT name FROM department`, (err, data) => department = data);

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "newDepartment",
        validate: (newDepartment) => {
          if (!newDepartment)
            return "Department must have a name.";

          for (var i = 0; i < department.length; i++) {
            if (department[i].name.toLowerCase() === newDepartment.toLowerCase())
              return "Department name already exists. Use a different name.";
          }

          return true;
        }
      }
    ])
    .then((response) => {
      console.log(`\nAdded new ${response.newDepartment} department.\n`);

      db.query("INSERT INTO department (name) VALUES (?);", response.newDepartment, (err, data) => {
        mainMenu(db);
      });
    });
}

function goodbye() {
  art.font("Goodbye", "doom", (err, rendered) => {
    if (err)
      console.error(err);
    else
      console.log(art.style(rendered, "green", true))
  })

  process.exit(0);
}

module.exports = mainMenu;
