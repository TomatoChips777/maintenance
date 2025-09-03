// Users/UserTopNavbar.jsx
import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Dropdown,
  Badge,
  Image,
  Container,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { PersonCircle } from "react-bootstrap-icons";
import axios from "axios";
import { io } from "socket.io-client";
import TextTruncate from "../extra/TextTruncate";
import FormatDate from "../extra/DateFormat";

function UserTopNavbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [activeLink, setActiveLink] = useState("Report");

  // Sync active link with current route
  useEffect(() => {
    if (location.pathname.includes("my-reports")) {
      setActiveLink("My Reports");
    } else if (location.pathname.includes("notifications")) {
      setActiveLink("Notifications");
    } else {
      setActiveLink("Report");
    }
  }, [location.pathname]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_GET_NOTIFICATIONS}/${user.id}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on("updateNotifications", () => {
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle navigation
  const handleNavClick = (key) => {
    setActiveLink(key);

    const routeMap = {
      Report: "/user/report",
      "My Reports": "/user/my-reports",
      Notifications: "/user/notifications",
    };
    navigate(routeMap[key]);
  };

  return (
    <Navbar
      bg="success"
      variant="dark"
      expand="xl"
      sticky="top"
      className="px-3 p-3"
      
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand
          href="#"
          onClick={() => handleNavClick("Report")}
          className="fw-bold"
        >
          Maintenance Reporting
        </Navbar.Brand>

        {/* Mobile toggle */}
        <Navbar.Toggle aria-controls="user-navbar-nav" />

        {/* Collapsible links */}
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="me-auto">
            {["Report", "My Reports"].map((key) => (
              <Nav.Link
                key={key}
                onClick={() => handleNavClick(key)}
                className={
                  activeLink === key
                    ? "fw-bold text-light"
                    : "text-white"
                }
              >
                {key}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>

        {/* Always visible on right side */}
        <Nav className="d-flex align-items-center">
          {/* Notifications Dropdown */}
          <Dropdown align="end" className="me-3">
            <Dropdown.Toggle
              variant="success"
              className={`position-relative border-0 ${
                activeLink === "Notifications" ? "fw-bold text-warning" : ""
              }`}
              onClick={() => handleNavClick("Notifications")}
            >
              <i className="bi bi-bell-fill fs-5"></i>
              {notifications.length > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute start-100 translate-middle"
                  style={{ top: "20%" }}
                >
                  {notifications.length}
                </Badge>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-end">
              <Dropdown.ItemText>
                You have {notifications.length} notifications
              </Dropdown.ItemText>
              <Dropdown.Divider />
              {notifications.map((n, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleNavClick("Notifications")}
                >
                  <TextTruncate text={n.message} maxLength={40} />
                  <div className="text-muted small">
                    {FormatDate(n.created_at)}
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="success"
              className="d-flex align-items-center border-0"
            >
              {user?.image_url ? (
                <Image
                  src={`${import.meta.env.VITE_IMAGES}/${user.image_url}`}
                  roundedCircle
                  className="me-2"
                  width={30}
                  height={30}
                  alt="User"
                />
              ) : (
                <PersonCircle className="me-2" size={30} />
              )}
              <span className="d-none d-sm-inline">
                {user?.name || user?.email || "User"}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Profile</Dropdown.Item>
              <Dropdown.Item href="#">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={signOut}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default UserTopNavbar;
