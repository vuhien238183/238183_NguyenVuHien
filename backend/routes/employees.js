const express = require("express");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");

const router = express.Router();

const FIELDS = [
  "employeeId", "fullName", "gender", "dateOfBirth", "department",
  "position", "email", "phone", "hireDate", "status",
];

// Chi lay cac truong hop le tu body
const pickFields = (body) => {
  const data = {};
  FIELDS.forEach((f) => {
    if (body[f] !== undefined) data[f] = body[f];
  });
  return data;
};

// Escape ky tu dac biet de tim kiem an toan
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Tim nhan vien theo _id hoac ma nhan vien
const findEmployee = async (id) => {
  if (mongoose.isValidObjectId(id)) {
    const byId = await Employee.findById(id);
    if (byId) return byId;
  }
  return Employee.findOne({ employeeId: id });
};

// GET /api/employees?search=...
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let filter = {};
    if (search && search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      filter = { $or: [{ employeeId: regex }, { fullName: regex }] };
    }
    const employees = await Employee.find(filter).sort({ employeeId: 1 });
    res.json(employees);
  } catch (err) {
    next(err);
  }
});

// GET /api/employees/:id
router.get("/:id", async (req, res, next) => {
  try {
    const employee = await findEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Khong tim thay nhan vien" });
    }
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// POST /api/employees
router.post("/", async (req, res, next) => {
  try {
    const data = pickFields(req.body);
    const exists = await Employee.findOne({ employeeId: data.employeeId });
    if (exists) {
      return res.status(409).json({ message: "Ma nhan vien da ton tai" });
    }
    const employee = await Employee.create(data);
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
});

// PUT /api/employees/:id
router.put("/:id", async (req, res, next) => {
  try {
    const employee = await findEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Khong tim thay nhan vien" });
    }
    const data = pickFields(req.body);
    if (data.employeeId && data.employeeId !== employee.employeeId) {
      const dup = await Employee.findOne({ employeeId: data.employeeId });
      if (dup) {
        return res.status(409).json({ message: "Ma nhan vien da ton tai" });
      }
    }
    employee.set(data);
    await employee.save();
    res.json(employee);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/employees/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const employee = await findEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Khong tim thay nhan vien" });
    }
    await employee.deleteOne();
    res.json({ message: "Xoa nhan vien thanh cong" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;