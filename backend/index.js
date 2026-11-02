const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const testConnection = require("./utils/testConnection");

// Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const roomRoutes = require("./routes/roomRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const messManagerRoutes = require("./routes/messManagerRoutes");
const messRoutes = require("./routes/messRoutes");

const app = express();

// ================= Middleware =================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= Routes =================

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student/leave", leaveRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/mess-manager", messManagerRoutes);
app.use("/api/mess", messRoutes);

// ================= Health Check =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HMMS Backend is running successfully!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`HMMS server is running on http://localhost:${PORT}`);
  await testConnection();
});