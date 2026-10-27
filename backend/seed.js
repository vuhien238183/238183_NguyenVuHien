require("dotenv").config();
const mongoose = require("mongoose");
const Employee = require("./models/Employee");

const samples = [
  { employeeId: "NV001", fullName: "Nguyen Van An", gender: "Nam", dateOfBirth: "1995-03-15", department: "Ke toan", position: "Ke toan vien", email: "an.nguyen@example.com", phone: "0901234567", hireDate: "2021-06-01", status: "Dang lam viec" },
  { employeeId: "NV002", fullName: "Tran Thi Binh", gender: "Nu", dateOfBirth: "1998-07-22", department: "Nhan su", position: "Chuyen vien", email: "binh.tran@example.com", phone: "0912345678", hireDate: "2022-02-10", status: "Dang lam viec" },
  { employeeId: "NV003", fullName: "Le Minh Cuong", gender: "Nam", dateOfBirth: "1992-11-05", department: "Cong nghe thong tin", position: "Lap trinh vien", email: "cuong.le@example.com", phone: "0923456789", hireDate: "2020-09-15", status: "Nghi viec" },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const s of samples) {
    await Employee.updateOne({ employeeId: s.employeeId }, { $set: s }, { upsert: true });
  }
  console.log("Da them", samples.length, "nhan vien mau");
  await mongoose.disconnect();
})().catch((e) => {
  console.error("Loi:", e.message);
  process.exit(1);
});