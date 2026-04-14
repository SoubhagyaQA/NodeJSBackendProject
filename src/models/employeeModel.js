const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {type: String,unique: true},
    name: {type: String, required: true},
    department: {type: String,required: true},
    designation: {type: String,required: true},
    status: {type: String,enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("addEmployee", employeeSchema);