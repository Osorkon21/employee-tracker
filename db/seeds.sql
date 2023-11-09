USE employee_db;

INSERT INTO department (name)
VALUES 
  ("Sales"),
  ("Engineering"),
  ("Finance"),
  ("Legal");
       
INSERT INTO role(title, department_id, salary)
VALUES 
  ("Sales Lead", 1, 100000),
  ("Salesperson", 1, 80000),
  ("Lead Engineer", 2, 150000),
  ("Software Engineer", 2, 120000),
  ("Account Manager", 3, 160000),
  ("Accountant", 3, 125000),
  ("Legal Team Lead", 4, 250000),
  ("Lawyer", 4, 190000);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
  ("Jean-Claude", "Van Damme", 1, NULL),
  ("Dolph", "Lundgren", 2, 1),
  ("Arnold", "Schwarzenegger", 3, NULL),
  ("Linda", "Hamilton", 4, 3),
  ("Sigourney", "Weaver", 5, NULL),
  ("Michael", "Biehn", 6, 5),
  ("Sylvester", "Stallone", 7, NULL),
  ("Sandra", "Bullock", 8 , 7);

