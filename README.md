# GT-Homework-12-Employee-Tracker

A Node CLI allowing users to view, add, and edit an employee database.

## Description

The application will let the user keep track of employees utilizing a database which organizes employees in relation to department and role. The user can view their departments, employees, and employee roles by lists, and edit the data in each list. As well as viewing and editing database data, the user can add new information to their database, which will be reflected in the each list.

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Design](#design)
* [Contributing](#contributing)
* [Repository](#repository)
* [Questions](#questions)
* [License](#license)

## Installation

Install the necessary dependencies in the command line with:

```sh
npm install
```

## Usage

After dependencies are installed, run the application in the command line with:

```sh
node employeeTrackerCLI.js
```

Choose from the list of prompts to input and edit data.

The following demonstrates general application functionality:

![employee-tracker demo](./assets/images/employee-tracker.gif)

## Design

Design the following database schema containing three tables:

![Database Schema](assets/images/schema.png)

* **department**:

  * **id** - INT PRIMARY KEY
  * **name** - VARCHAR(30) to hold department name

* **role**:

  * **id** - INT PRIMARY KEY
  * **title** -  VARCHAR(30) to hold role title
  * **salary** -  DECIMAL to hold role salary
  * **department_id** -  INT to hold reference to department role belongs to

* **employee**:

  * **id** - INT PRIMARY KEY
  * **first_name** - VARCHAR(30) to hold employee first name
  * **last_name** - VARCHAR(30) to hold employee last name
  * **role_id** - INT to hold reference to role employee has
  * **manager_id** - INT to hold reference to another employee that manager of the current employee. This field may be null if the employee has no manager

## Contributing

None.

## Repository

[Github Repository](https://github.com/AlanAshworth/GT-Homework-12-Employee-Tracker)

## Questions

<img src="https://avatars3.githubusercontent.com/u/54105679?v=4" alt="avatar" width="100px" height="100px" />

Contact me at <a href="mailto:awashworth927@gmail.com">awashworth927@gmail.com</a>

## License

© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.