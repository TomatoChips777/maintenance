import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function LandingNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="p-3 px-3">
      <Container fluid>
        {/* Left side brand */}
        <Navbar.Brand className="fw-bold">Maintenance Reporting</Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Right side nav links */}
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => navigate("/")}
              className={
                location.pathname === "/"
                  ? "fw-bold text-light"
                  : "text-white"
              }
            >
              Home
            </Nav.Link>
           
            <Nav.Link
              onClick={() => navigate("/login")}
              className={
                location.pathname === "/login"
                  ? "fw-bold text-light"
                  : "text-white"
              }
            >
              Login
            </Nav.Link>

             <Nav.Link
              onClick={() => navigate("/about")}
              className={
                location.pathname === "/about"
                  ? "fw-bold text-light"
                  : "text-white"
              }
            >
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default LandingNavbar;
