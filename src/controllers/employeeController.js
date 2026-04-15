const Employee = require("../models/employeeModel");
const generateEmployeeId = require("../utils/generateEmployeeId");
const response = require("../libs/responseLib")

const addEmployee = async (req, res) => {
  try {
    const { name, department, designation, status } = req.body;
    const employeeId = await generateEmployeeId(); // autogenerate function call from utils 
  
    const newEmployee = await Employee.create({
      employeeId,
      name,
      department,
      designation,
      status
    });

    res.status(201).json({
      status: 201,
      msg: "Employee added successfully",
      data: {
        employeeId: newEmployee.employeeId,
        name: newEmployee.name
      }
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Server error",
      error: err.message
    });
  }
};

// LIST EMPLOYEE
const listEmployees = async (req, res) => {
  try {

    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 200,
      msg: "Employee list fetched successfully",
      total: employees.length,
      data: employees
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Server error",
      error: err.message
    });
  }
};

// VIEW EMPLOYEE
const viewEmployee = async (req, res) => {
  try {

    const { id } = req.params;

    const employee = await Employee.findOne({ employeeId : id });
    if (!employee) {
      return res.status(404).json({
        status: 404,
        msg: "Employee not found"
      });
    }
    res.status(200).json({
      status: 200,
      msg: "Employee details fetched",
      employeeId: employee.employeeId,
      data: employee
    });

  } catch (err) {
    res.status(500).json({
      status: 500,
      msg: "Server error",
      error: err.message
    });
  }
};



// EDIT EMPLOYEE
const editEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, department, designation, status } = req.body;

    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { name, department, designation, status },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        status: 404,
        msg: "Employee not found"
      });
    }
    res.status(200).json({status: 200,
      msg: "Employee updated successfully",
      data: employee
    });
  } catch (err) {
    res.status(500).json({status: 500,
      msg: "Server error",
      error: err.message
    });
  }
};

//Search Employee

const searchEmployee = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    let filter = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
    if (department) {
      filter.department = department;
    }
    if (status) {
      filter.status = status;
    }
    const employees = await Employee
      .find(filter)
      .select("employeeId name department designation status -_id");
    // if no data found
    if (employees.length === 0) {
      return res.json(
        response.generate(false, "No data found", [])
      );
    }

    return res.json(
      response.generate(false, "Search result fetched", employees)
    );
  } catch (err) {
    return res.status(500).json(
      response.generate(true, "Server error", err.message)
    );
  }
};

const paginatedEmployees = async (req, res) => {
  try {

    const { page, limit } = req.query;

    const skip = (page - 1) * limit;

    const employees = await Employee.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Employee.countDocuments();

    return res.json(
      response.generate(false, "Employee list fetched", {
        employees,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      })
    );

  } catch (err) {

    return res.status(500).json(
      response.generate(true, "Server error", err.message)
    );

  }
};
module.exports = {
  addEmployee,
  listEmployees,
  viewEmployee,
  editEmployee,
  searchEmployee,
  paginatedEmployees
  
};