require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const employeeRoutes = require("./routes/employees");

const app = express();
const PORT = process.env.PORT || 5000;

// CLIENT_URL: co the nhieu dia chi, ngan cach bang dau phay
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Khong duoc phep boi CORS"));
    },
  })
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/employees", employeeRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Khong tim thay duong dan" });
});

// Xu ly loi chung
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Ma nhan vien da ton tai" });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Du lieu khong hop le" });
  }
  console.error(err);
  res.status(500).json({ message: "Loi may chu" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Da ket noi MongoDB Atlas");
    app.listen(PORT, () => console.log(`Server chay tai cong ${PORT}`));
  })
  .catch((err) => {
    console.error("Loi ket noi MongoDB:", err.message);
    process.exit(1);
  });