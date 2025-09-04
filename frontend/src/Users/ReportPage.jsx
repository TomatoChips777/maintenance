import { useState, useEffect, useRef } from "react";
import { Container, Card, Form, Button, Alert, Modal } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../AuthContext";
import axios from "axios";

function ReportPage() {
  const { user, signIn } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    location: "",
    description: "",
    urgency: "Normal",
    image: null,
    issue_type: ''
  });

  const resetForm = () => {
    setFormData({
      user_id: user?.id || "",
      location: "",
      description: "",
      urgency: "Normal",
      image: null,
      issue_type: '',
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);
  const [successModal, setShowSuccessModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      user_id: user?.id || "",
    }));
  }, [user]);

  // Google Login
  const handleGoogleLogin = async (credentialsResponse) => {
    setLoading(true);
    try {
      const decodedToken = jwtDecode(credentialsResponse.credential);
      const user = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        photo: decodedToken.picture,
      };
      const response = await axios.post(`${import.meta.env.VITE_LOGIN_API}`, {
        email: user.email,
        name: user.name,
        picture: user.photo,
        token: user.id,
      });
      signIn(response.data);
      setShowGoogleLogin(false);
    } catch (error) {
      setError("Error logging in with Google");
    } finally {
      setLoading(false);
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowGoogleLogin(true);
      return;
    }
    handleFormSubmission();
  };

  const handleFormSubmission = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      resetForm();
      setImagePreview(null);
      setShowSuccessModal(true);
    } catch (error) {
      setError("Failed to submit the report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Card className="shadow-sm p-2">
        <Card.Header className="bg-success text-white fw-bold p-4">
          Report a Maintenance Issue
        </Card.Header>
        <Card.Body>
          <p className="text-muted">
            Please fill out the details below to report any broken equipment,
            facility issue, or maintenance concern within the campus.
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Location of Issue</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Library - 2nd Floor"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type of Report</Form.Label>
             <Form.Select 
             className="p-3"
             value={formData.issue_type} 
             onChange={(e) => 
             setFormData({ ...formData, issue_type: e.target.value})}>
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="General Repair">General Repair</option>
              <option value="Others">Others</option>
             </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Issue Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Describe the issue in detail..."
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="p-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image (optional)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setFormData({ ...formData, image: file });
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="p-3"
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "200px", borderRadius: "8px" }}
                  />
                </div>
              )}
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={loading} className="p-2">
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Google Login Modal */}
      <Modal show={showGoogleLogin} onHide={() => setShowGoogleLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign In with Google</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please sign in with your Google account to submit the report.</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Error during Google login")}
            theme="filled_blue"
            shape="rectangular"
            text="signin_with"
            width="100%"
          />
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={successModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Report Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your maintenance report has been submitted successfully! ✅</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ReportPage;
