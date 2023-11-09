// imports
const art = require("ascii-art");
const mainMenu = require("./assets/js/prompts");
const mysql = require('mysql2');

// create database connection
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: "password",
    database: "employee_db"
  }
);

// generate ASCII art for console
art.font("Employee Tracker", "doom", (err, rendered) => {
  if (err)
    console.error(err);
  else {

    // style and print ASCII console art
    console.log(art.style(rendered, "cyan", true));

    // go to app's main menu
    mainMenu(db);
  }
})
