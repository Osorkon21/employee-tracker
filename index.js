// GIVEN a command - line application that accepts user input
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

const inquirer = require("inquirer");
const mysql = require('mysql2');
const { printTable } = require("console-table-printer");

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: "password",
    database: "employee_db"
  },
  console.log(`Connected to the employee_db database.`)
);

// Query database - sample SQL query if you're not using Sequelize (results are a JSON, I think)
db.query('SELECT * FROM employee', function (err, results) {
  printTable(results);
});

// do I need to use express? Don't think so

// do I need to be able to create new databases on other users' computers, or just mine? If just mine, what do I put in Instructions in README?

// do I need to give the user the ability to disconnect from the database at any point? Or is it assumed user exits app by killing terminal?

// how do I get the big splash screen on the console like in the walkthrough video?
