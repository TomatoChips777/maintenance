import React from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import ReportPage from "./ReportPage";
import Notifications from "../Notifications/Notifications";
import UserTopNavbar from "./UserTopNavbar"; 
import UserReports from "./UserReports";
function UserDashboard() {
  return (
    <div className="vh-100 d-flex flex-column">
      {/* Top Navbar */}
      <UserTopNavbar />

      {/* Page Content */}
      <Container className="flex-grow-1 p-4">
        <Routes>
          <Route path="/user/report" element={<ReportPage />} />
          <Route
            path="/user/my-reports"
            element={
             <UserReports/>
            }
          />
          <Route path="/user/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/user/report" replace />} />
        </Routes>
      </Container>
    </div>
  );
}

export default UserDashboard;
