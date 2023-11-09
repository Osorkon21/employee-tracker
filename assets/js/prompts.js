// imports
const inquirer = require("inquirer");
const art = require("ascii-art");
const { printTable } = require("console-table-printer");

// direct traffic from main menu
function directFromMainMenu(response, db) {
  switch (response.choice) {
    case 0:
      viewAllEmployees(db);
      return;
    case 1:
      addEmployee(db);
      return;
    case 2:
      updateEmployeeRole(db);
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

// app's main menu
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

// get all employees, join additional tables as needed, print to console, then return to main menu
function viewAllEmployees(db) {
  db.promise()
    .query('SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name) manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.last_name;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

// add new employee to database
function addEmployee(db) {

  // get list of current employees
  db.query("SELECT id, first_name, last_name FROM employee;", (err, data) => {

    // format current employee query data for inquirer list choices
    var manager = data.map((obj) => ({ name: (obj.first_name + " " + obj.last_name), value: obj.id }));

    // get list of roles
    db.query("SELECT id, title FROM role;", (err, data) => {

      // format role query data for inquirer list choices
      var roles = data.map((obj) => ({ name: obj.title, value: obj.id }));

      // allows employees that do not have a manager to be added
      manager.unshift({ name: "None", value: null });

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",

            // first name cannot be blank
            validate: (firstName) => {
              if (!firstName)
                return "Employee must have a first name.";

              return true;
            }
          },
          {
            type: "input",
            message: "What is the employee's last name?",
            name: "lastName",

            // last name cannot be blank
            validate: (lastName) => {
              if (!lastName)
                return "Employee must have a last name.";

              return true;
            }
          },
          {
            type: "list",
            message: "What is the employee's role?",
            name: "role_id",
            choices: roles
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            name: "manager_id",
            choices: manager
          }
        ])
        .then((response) => {
          console.log(`\nAdded ${response.firstName} ${response.lastName} as an employee.\n`);

          // add new employee to database, return to main menu
          db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [response.firstName, response.lastName, response.role_id, response.manager_id], (err, data) => {
            mainMenu(db);
          });
        });
    });
  })
}

// change existing employee's role
function updateEmployeeRole(db) {

  // get list of employees
  db.query("SELECT id, CONCAT(first_name, ' ', last_name) name FROM employee;", (err, data) => {

    // format employee query data for inquirer list choices
    var employees = data.map((obj) => ({ name: obj.name, value: obj.id }));

    // get list of roles
    db.query("SELECT id, title FROM role", (err, data) => {

      // format role query data for inquirer list choices
      var roles = data.map((obj) => ({ name: obj.title, value: obj.id }));

      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee's role do you want to update?",
            name: "employee_id",
            choices: employees
          },
          {
            type: "list",
            message: "Which role do you want to assign to the selected employee?",
            name: "role_id",
            choices: roles
          }
        ])
        .then((response) => {
          console.log(`\nUpdated employee's role.\n`);

          // change existing employee's role, return to main menu
          db.query("UPDATE employee SET role_id = ? WHERE id = ?;", [response.role_id, response.employee_id], (err, data) => mainMenu(db)
          );
        });
    });
  })
}

// get all roles, print to console, then return to main menu
function viewAllRoles(db) {
  db.promise()
    .query('SELECT role.id, title, department.name department, salary FROM role JOIN department ON role.department_id = department.id ORDER BY department;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

// add new role to database
function addRole(db) {
  var role;

  // get role titles
  db.query("SELECT title FROM role", (err, data) => role = data);

  // get department table
  db.query("SELECT * FROM department;", (err, data) => {

    // format department query data for inquirer list choices
    var departments = data.map((obj) => ({ name: obj.name, value: obj.id }))

    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the title of the role?",
          name: "newTitle",
          validate: (newTitle) => {

            // new role title cannot be blank
            if (!newTitle)
              return "Role must have a title.";

            // test new role title against existing role titles, reject if match found
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

            // newSalary must be a number
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

        // add new role to database, return to main menu
        db.query("INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?);", [response.newTitle, response.department_id, response.newSalary], (err, data) => mainMenu(db)
        );
      });
  });
}

// get all departments, print to console, then return to main menu
function viewAllDepartments(db) {
  db.promise()
    .query('SELECT * FROM department ORDER BY name;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

// add new department to database
function addDepartment(db) {
  var department;

  // get department names
  db.query(`SELECT name FROM department`, (err, data) => department = data);

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "newDepartment",
        validate: (newDepartment) => {

          // new department name cannot be blank
          if (!newDepartment)
            return "Department must have a name.";

          // test new department name against existing department names, reject if match found
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

      // add new department to database, return to main menu
      db.query("INSERT INTO department (name) VALUES (?);", response.newDepartment, (err, data) => {
        mainMenu(db);
      });
    });
}

// display exit message, quit app
function goodbye() {

  // generate ASCII art exit message
  art.font("Goodbye", "doom", (err, rendered) => {
    if (err)
      console.error(err);
    else

      // style and display ASCII art exit message
      console.log(art.style(rendered, "green", true))
  })

  // exit app, return to console prompt
  process.exit(0);
}

// exports
module.exports = mainMenu;
