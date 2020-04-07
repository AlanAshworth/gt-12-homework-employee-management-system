USE employee_tracker_db;

INSERT INTO department (name)
VALUES ("Executive");
INSERT INTO department (name)
VALUES ("Research");
INSERT INTO department (name)
VALUES ("Maintenance");
INSERT INTO department (name)
VALUES ("Containment");

INSERT INTO role (title, salary, department_id)
VALUES ("Director", 100000.00, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Head of Reasearch", 80000.00, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Janitor", 30000.00, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Candidiate", 0.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jesse","Faden",1,null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily","Pope",2,1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ahti" ,null,3,1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dylan", "Faden",4,1);
