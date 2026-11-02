import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import ErrorBoundary from "../components/ui/ErrorBoundary";

// Student
import StudentDashboard from "../pages/student/Dashboard";
import StudentRoom from "../pages/student/Room";
import StudentAttendance from "../pages/student/Attendance";
import StudentFees from "../pages/student/Fees";
import StudentMess from "../pages/student/Mess";
import StudentLeave from "../pages/student/Leave";
import StudentComplaints from "../pages/student/Complaints";

// Warden
import WardenDashboard from "../pages/warden/Dashboard";
import WardenStudents from "../pages/warden/Students";
import WardenRooms from "../pages/warden/Rooms";
import LeaveRequests from "../pages/warden/LeaveRequests";
import Complaints from "../pages/warden/Complaints";
import WardenAttendance from "../pages/warden/Attendance";
import WardenFeeReport from "../pages/warden/FeeReport";

// Admin
import AdminDashboard from "../pages/admin/Dashboard";
import AdminStudents from "../pages/admin/Students";
import AdminWardens from "../pages/admin/Wardens";
import AdminMessManagers from "../pages/admin/MessManagers";
import AdminRooms from "../pages/admin/Rooms";

// Mess Manager
import MessManagerDashboard from "../pages/mess-manager/Dashboard";
import FeeReport from "../pages/mess-manager/FeeReport";
import MessAttendance from "../pages/mess-manager/Attendance";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Student Portal */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/room" element={<StudentRoom />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/fees" element={<StudentFees />} />
          <Route path="/student/mess" element={<StudentMess />} />
          <Route path="/student/leave" element={<StudentLeave />} />
          <Route path="/student/complaints" element={<StudentComplaints />} />

          {/* Warden Portal */}
          <Route path="/warden" element={<WardenDashboard />} />
          <Route path="/warden/students" element={<WardenStudents />} />
          <Route path="/warden/rooms" element={<WardenRooms />} />
          <Route path="/warden/leaves" element={<LeaveRequests />} />
          <Route path="/warden/complaints" element={<Complaints />} />
          <Route path="/warden/attendance" element={<WardenAttendance />} />
          <Route path="/warden/fees" element={<WardenFeeReport />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/wardens" element={<AdminWardens />} />
          <Route path="/admin/mess-managers" element={<AdminMessManagers />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />

          {/* Mess Manager Portal */}
          <Route path="/mess-manager" element={<MessManagerDashboard />} />
          <Route path="/mess-manager/fees" element={<FeeReport />} />
          <Route path="/mess-manager/attendance" element={<MessAttendance />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}