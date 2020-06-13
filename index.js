// Set ASCII Logo
import logo from "asciiart-logo";

const longText =
  "A Node CLI allowing users to view, add, and edit an employee database.";

console.log(
  logo({
    name: "Employee Management System",
    font: "Small Slant",
    lineChars: 10,
    padding: 2,
    margin: 3,
    borderColor: "white",
    logoColor: "bold-red",
    textColor: "red",
  })
    .emptyLine()
    .right("version 2.0.0")
    .emptyLine()
    .center(longText)
    .render()
);

// Start
import EMS from "./app/js/EMS";
const ems = new EMS();
ems.main();
