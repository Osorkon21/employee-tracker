
// View All Departments
db.query('SELECT * FROM department;', function (err, results) {
  printTable(results);
});

// View All Roles
db.query('SELECT role.id, title, department.name department, salary FROM role JOIN department ON role.department_id = department.id;', function (err, results) {
  printTable(results);
});

// View All Employees
db.query('SELECT e.id, e.first_name, e.last_name, r.title, d.name department, r.salary, CONCAT(m.first_name, " ", m.last_name) manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id LEFT JOIN employee m ON e.manager_id = m.id;', function (err, results) {
  printTable(results);
});
