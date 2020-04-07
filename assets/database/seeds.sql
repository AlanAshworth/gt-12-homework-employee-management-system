USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Executive")
VALUES ("Research")
VALUES ("Maintenance")
VALUES ("Containment");

INSERT INTO role (title, salary, department_id)
VALUES ("Director", 100000.00, 1)
VALUES ("Head of Reasearch", 80000.00, 2)
VALUES ("Janitor", 30000.00, 3)
VALUES ("Candidiate", 0.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jesse","Faden",1,null)
VALUES ("Emily","Pope",2,1)
VALUES ("Ahti" ,null,3,1)
VALUES ("Dylan", "Faden",4,1);
