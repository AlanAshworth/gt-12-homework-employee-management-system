-- Drop the database 'gt_12_EmployeeManagementSystem'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Uncomment the ALTER DATABASE statement below to set the database to SINGLE_USER mode if the drop database command fails because the database is in use.
-- ALTER DATABASE gt_12_EmployeeManagementSystem SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
-- Drop the database if it exists
IF EXISTS (
  SELECT name
   FROM sys.databases
   WHERE name = N'gt_12_EmployeeManagementSystem'
)
DROP DATABASE gt_12_EmployeeManagementSystem
GO

-- Create a new database called 'gt_12_EmployeeManagementSystem'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
  SELECT name
    FROM sys.databases
    WHERE name = N'gt_12_EmployeeManagementSystem'
)
CREATE DATABASE gt_12_EmployeeManagementSystem
GO

-- Connect to the specified database
USE gt_12_EmployeeManagementSystem
GO

-- Create a new table called 'Department' in schema 'gt_12_EmployeeManagementSystem'
-- Drop the table if it already exists
IF OBJECT_ID('gt_12_EmployeeManagementSystem.Department', 'U') IS NOT NULL
DROP TABLE gt_12_EmployeeManagementSystem.Department
GO
-- Create the table in the specified schema
CREATE TABLE gt_12_EmployeeManagementSystem.Department
(
  DepartmentId INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
  [Name] [NVARCHAR](50) NOT NULL
  -- specify more columns here
);
GO

-- Create a new table called 'Role' in schema 'gt_12_EmployeeManagementSystem'
-- Drop the table if it already exists
IF OBJECT_ID('gt_12_EmployeeManagementSystem.Role', 'U') IS NOT NULL
DROP TABLE gt_12_EmployeeManagementSystem.Role
GO
-- Create the table in the specified schema
CREATE TABLE gt_12_EmployeeManagementSystem.Role
(
  RoleId INT NOT NULL PRIMARY KEY, -- primary key column
  Title [NVARCHAR](50) NOT NULL,
  Salary DECIMAL(7,2) NOT NULL,
  DepartmentId INT NOT NULL,
  FOREIGN KEY (DepartmentId)
  REFERENCES gt_12_EmployeeManagementSystem.Department (DepartmentId)
  -- specify more columns here
);
GO

-- Create a new table called 'Employee' in schema 'gt_12_EmployeeManagementSystem'
-- Drop the table if it already exists
IF OBJECT_ID('gt_12_EmployeeManagementSystem.Employee', 'U') IS NOT NULL
DROP TABLE gt_12_EmployeeManagementSystem.Employee
GO
-- Create the table in the specified schema
CREATE TABLE gt_12_EmployeeManagementSystem.Employee
(
  EmployeeId INT NOT NULL PRIMARY KEY, -- primary key column
  FirstName [NVARCHAR](50) NOT NULL,
  LastName [NVARCHAR](50) NOT NULL,
  RoleId INT NOT NULL,
  FOREIGN KEY (RoleId)
  REFERENCES gt_12_EmployeeManagementSystem.Role (RoleId),
  ManagerId INT NOT NULL,
  FOREIGN KEY (ManagerId)
  REFERENCES gt_12_EmployeeManagementSystem.Employee (EmployeeId)
  -- specify more columns here
);
GO