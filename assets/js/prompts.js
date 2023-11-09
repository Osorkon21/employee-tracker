const inquirer = require("inquirer");
const art = require("ascii-art");
const { printTable } = require("console-table-printer");

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
    .query('SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name) manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id ORDER BY e.last_name;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function addEmployee(db) {
  db.query("SELECT id, first_name, last_name FROM employee;", (err, data) => {
    var manager = data.map((obj) => ({ name: (obj.first_name + " " + obj.last_name), value: obj.id }));

    db.query("SELECT id, title FROM role;", (err, data) => {
      var roles = data.map((obj) => ({ name: obj.title, value: obj.id }));
      manager.unshift({ name: "None", value: null });

      inquirer
        .prompt([
          {
            type: "input",
            message: "What is the employee's first name?",
            name: "firstName",
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

          db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);", [response.firstName, response.lastName, response.role_id, response.manager_id], (err, data) => {
            mainMenu(db);
          });
        });
    });
  })
}

function updateEmployeeRole(db) {
  db.query("SELECT id, CONCAT(first_name, ' ', last_name) name FROM employee;", (err, data) => {
    var employees = data.map((obj) => ({ name: obj.name, value: obj.id }));

    db.query("SELECT id, title FROM role", (err, data) => {
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

          db.query("UPDATE employee SET role_id = ? WHERE id = ?;", [response.role_id, response.employee_id], (err, data) => mainMenu(db)
          );
        });
    });
  })
}

function viewAllRoles(db) {
  db.promise()
    .query('SELECT role.id, title, department.name department, salary FROM role JOIN department ON role.department_id = department.id ORDER BY department;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function addRole(db) {
  var role;

  db.query("SELECT title FROM role", (err, data) => role = data);

  db.query("SELECT * FROM department;", (err, data) => {
    var departments = data.map((obj) => ({ name: obj.name, value: obj.id }))

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

        db.query("INSERT INTO role (title, department_id, salary) VALUES (?, ?, ?);", [response.newTitle, response.department_id, response.newSalary], (err, data) => mainMenu(db)
        );
      });
  });
}

function viewAllDepartments(db) {
  db.promise()
    .query('SELECT * FROM department ORDER BY name;')
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
