const art = require("ascii-art");
const mainMenu = require("./assets/js/prompts");
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: "password",
    database: "employee_db"
  }
);

art.font("Employee Tracker", "doom", (err, rendered) => {
  if (err)
    console.error(err);
  else {
    console.log(art.style(rendered, "cyan", true));

    mainMenu(db);
  }
})
