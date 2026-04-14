const Employee = require("../models/employeeModel");

const generateEmployeeId = async () => {
  const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });

  // If no employees exist, start with EMP001
  if (!lastEmployee || !lastEmployee.employeeId) {
    return "EMP001";
  }
  // Extract number and increment
  const lastId = lastEmployee.employeeId;
  const number = parseInt(lastId.replace("EMP", ""), 10) + 1;
  return `EMP${number.toString().padStart(3, "0")}`;
};

module.exports = generateEmployeeId;