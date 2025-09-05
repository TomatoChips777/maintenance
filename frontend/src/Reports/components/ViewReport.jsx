import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
import { useState, useEffect } from 'react';
import axios from 'axios';

const ViewReport = ({ show, handleClose, report }) => {
  const [formData, setFormData] = useState({
    priority: '',
    status: '',
    issue_type: ''
  });
  const [saving, setSaving] = useState(false);

  // For confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);

  useEffect(() => {
    if (report) {
      setFormData({
        priority: report.priority || '',
        status: report.status || '',
        issue_type: report.issue_type || ''
      });
    }
  }, [report]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "status" &&
      ((report?.status === "Resolved" && value !== "Resolved") ||
        (report?.status === "In Progress" && value === "Pending"))
    ) {
      // Open confirmation modal
      setPendingChange({ name, value });
      setShowConfirm(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const confirmStatusChange = () => {
    if (pendingChange) {
      setFormData((prev) => ({
        ...prev,
        [pendingChange.name]: pendingChange.value
      }));
    }
    setShowConfirm(false);
    setPendingChange(null);
  };

  const cancelStatusChange = () => {
    setShowConfirm(false);
    setPendingChange(null);
  };

  const handleSave = async () => {
    if (!report?.id) return;

    try {
      setSaving(true);
      const response = await axios.put(
        `${import.meta.env.VITE_UPDATE_REPORT}/${report.id}`,
        formData
      );

      if (response.status === 200) {
        // console.log("Report updated:", response.data);
        handleClose();
      } else {
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update report:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Main Report Modal */}
      <Modal show={show} onHide={handleClose} size="xl" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Viewing Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            {report?.image_path && (
              <div className="mb-3 text-center">
                <Image
                  src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                  alt="Report"
                  fluid
                  style={{
                    maxHeight: '350px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </div>
            )}
            <Col sm={3}><strong>Date:</strong></Col>
            <Col>{FormatDate(report?.created_at)}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Reported By:</strong></Col>
            <Col>{report?.reporter_name || "—"}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Location:</strong></Col>
            <Col>{report?.location || "—"}</Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}><strong>Description:</strong></Col>
            <Col>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  padding: "8px",
                  border: "1px solid #dee2e6",
                  borderRadius: "0.25rem",
                  backgroundColor: "#f8f9fa"
                }}
              >
                {report?.description || "—"}
              </div>
            </Col>
          </Row>

          {/* Priority */}
          <Row className="mb-3">
            <Col sm={3}><strong>Priority Level:</strong></Col>
            <Col>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Issue Type */}
          <Row className="mb-3">
            <Col sm={3}><strong>Issue Type:</strong></Col>
            <Col>
              <Form.Select
                name="issue_type"
                value={formData.issue_type}
                onChange={handleInputChange}
              >
                <option value="">Select issue type</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleaning">Cleaning</option>
                <option value="General Repair">General Repair</option>
                <option value="Others">Other</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Status */}
          <Row className="mb-3">
            <Col sm={3}><strong>Status:</strong></Col>
            <Col>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={cancelStatusChange} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Status Change</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {report?.status === "Resolved" && (
            <p>This report is already <strong>Resolved</strong>. Do you want to reopen it?</p>
          )}
          {report?.status === "In Progress" && (
            <p>This report is already <strong>In Progress</strong>. Do you want to mark it as Pending?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelStatusChange}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmStatusChange}>
            Yes, Change
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ViewReport;


