USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Executive"), ("Research"), ("Maintenance"), ("Containment");

INSERT INTO role (title, salary, department_id)
VALUES ("Director", 100000.00, 1), ("Head of Reasearch", 80000.00, 2), ("Janitor", 30000.00, 3), ("Candidiate", 0.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jesse","Faden",1,null), ("Emily","Pope",2,1), ("Ahti" ,null,3,1), ("Dylan", "Faden",4,1);
