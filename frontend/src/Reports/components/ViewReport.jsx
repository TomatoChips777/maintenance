import { Modal, Button, Row, Col, Form, Image } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';

const ViewReport = ({ show, handleClose, report }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
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
                maxHeight: "350px",
                objectFit: "contain",
                borderRadius: "8px",
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

        <Row className="mb-3">
          <Col sm={3}><strong>Priority Level:</strong></Col>
          <Col>
          <Form.Select value={report?.priority}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
          </Form.Select>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col sm={3}><strong>Status:</strong></Col>
          <Col>
          <Form.Select value={report?.status}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>

          </Form.Select>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewReport;
