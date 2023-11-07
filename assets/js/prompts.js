const inquirer = require("inquirer");
const { viewAllDepartments } = require("./queries");

function directFromMainMenu(response, db) {
  switch (response.choice) {
    case 0:
      viewAllDepartments(db);
      return;
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

module.exports = {
  mainMenu
}
