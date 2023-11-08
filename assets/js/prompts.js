const inquirer = require("inquirer");
const art = require("ascii-art");
const { printTable } = require("console-table-printer");

function directFromMainMenu(response, db) {
  switch (response.choice) {
    case 3:
      viewAllRoles(db);
      return;
    case 5:
      viewAllDepartments(db);
      return;
    case 7:
      goodbye();
    default:
      return;
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

function viewAllRoles(db) {
  db.promise()
    .query('SELECT role.id, title, department.name department, salary FROM role JOIN department ON role.department_id = department.id;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
}

function viewAllDepartments(db) {
  db.promise()
    .query('SELECT * FROM department;')
    .then(([rows, fields]) => printTable(rows))
    .catch((err) => console.error(err))
    .then(() => mainMenu(db));
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

// View All Employees
// db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name) manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', function (err, results) {
//   printTable(results);
// });

module.exports = mainMenu;
