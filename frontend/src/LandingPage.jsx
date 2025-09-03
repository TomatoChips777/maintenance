import React from "react";
import { Button, Card, Navbar, Container, Nav } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import LandingNavbar from "./LandingNavbar";

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReport = () => {
    navigate("/login"); // Navigate to login page without reload
  };

  return (
    <>
      <LandingNavbar/>
      {/* Hero Section */}
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Card className="text-center shadow-lg p-5" style={{ width: "600px" }}>
          <Card.Body>
            <Card.Title className="mb-4 fs-1 fw-bold text-success">
              Maintenance Reporting System
            </Card.Title>
            <Card.Text className="mb-5 fs-4">
              Report issues quickly and help us keep the campus safe and
              efficient.
            </Card.Text>
            <Button
              variant="dark"
              size="lg"
              className="px-5 py-3 fs-3 rounded-pill"
              onClick={handleReport}
            >
              Report
            </Button>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default LandingPage;
