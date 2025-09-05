// import React from "react";
// import { Container } from "react-bootstrap";
// import { Routes, Route, Navigate } from "react-router-dom";
// import ReportPage from "./ReportPage";
// import Notifications from "../Notifications/Notifications";
// import UserTopNavbar from "./UserTopNavbar"; 
// import UserReports from "./UserReports";
// function UserDashboard() {
//   return (
//     <>
//       {/* Top Navbar */}
//       <UserTopNavbar />

//       {/* Page Content */}
//       <Container className="user-main-content" fluid>
//         <Routes>
//           <Route path="/user/report" element={<ReportPage />} />
//           <Route path="/user/my-reports" element={<UserReports/>}/>
//           <Route path="/user/notifications" element={<Notifications />} />
//           <Route path="*" element={<Navigate to="/user/report" replace />} />
//         </Routes>
//       </Container>
//     </>
//   );
// }

// export default UserDashboard;

import React from "react";
import { Container } from "react-bootstrap";
import { Routes, Route, Navigate } from "react-router-dom";
import ReportPage from "./ReportPage";
import Notifications from "../Notifications/Notifications";
import UserTopNavbar from "./UserTopNavbar"; 
import UserReports from "./UserReports";

function UserDashboard() {
  return (
    <div className="user-dashboard">
      {/* Top Navbar */}
        <UserTopNavbar />

      {/* Main Content */}
      <Container fluid className="user-main-content">
        <Routes>
          <Route path="/user/report" element={<ReportPage />} />
          <Route path="/user/my-reports" element={<UserReports />} />
          <Route path="/user/notifications" element={<Notifications />} />
          <Route path="*" element={<Navigate to="/user/report" replace />} />
        </Routes>
      </Container>
    </div>
  );
}

export default UserDashboard;
