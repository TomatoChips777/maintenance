import { useState } from 'react';
import axios from 'axios';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  OverlayTrigger,
  Tooltip,
  Modal
} from 'react-bootstrap';
import UserAssistant from './Chatbot/UserAssistant';

const departments = [
  'SDI', 'MLS', 'GenEd', 'Nursing', 'Rad Teck Pharmacy', 'Respiratory',
  'Therapy', 'Physical Therapy', 'FMO', 'Library', 'Guidance Office',
  'Research Office', "Registrar's Office", 'Student Services Office',
  'Pastoral Services', 'Clinic', 'Alumni Office'
];

const commonItems = [
  'EUS Laptop1 w/charger',
  'EUS Laptop2 w/charger',
  'EUS Laptop3 w/charger',
  'EUS Laptop4 w/charger',
  'EUS Laptop5 w/charger',
  'EUS Laptop6 w/charger',
];

function RequestPage() {
  const [formData, setFormData] = useState({
    borrower_name: '',
    email: '',
    department: '',
    item: '',
    description: '',
    returned_date: '',
    status: 'Pending'
  });
  
  const [customItems, setCustomItems] = useState([{ name: '', quantity: '' }]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitted, setSubmitted] = useState(false);  
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCustomItemChange = (idx, field, value) => {
    const updated = [...customItems];
    updated[idx][field] = value;
    setCustomItems(updated);
  };

  const addCustomItemField = () => {
    setCustomItems([...customItems, { name: '', quantity: '' }]);
  };

  const removeCustomItemField = (idx) => {
    const updated = [...customItems];
    updated.splice(idx, 1);
    setCustomItems(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedItems(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalItems = [...selectedItems];

    customItems.forEach(item => {
      if (item.name.trim()) {
        const itemStr = item.quantity ? `${item.name} (x${item.quantity})` : item.name;
        finalItems.push(itemStr);
      }
    });

    const dateOnly = new Date(formData.returned_date);
    dateOnly.setHours(17, 0, 0, 0);

    const phTime = new Date(
      dateOnly.getTime() - (dateOnly.getTimezoneOffset() * 60000)
    ).toISOString().slice(0, 19).replace('T', ' ');

    const finalData = {
      ...formData,
      borrower: formData.borrower_name,
      item_name: formData.item,
      returned_date: phTime,
      item: finalItems.join(', ')
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_REQUEST_BORROW}`, finalData);
      if (response.data.success) {
        setShowSuccessModal(true);
        setSubmitted(true);
        setFormData({
          borrower_name: '',
          email: '',
          department: '',
          item: '',
          description: '',
          returned_date: '',
          status: 'Pending'
        });
        setSelectedItems([]);
        setCustomItems([{ name: '', quantity: '' }]);
      } else {
        console.error('Failed to add:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting borrow:', error);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <h2 className="text-center mb-4">Request Form</h2>

      <Card className="shadow-sm">
        <Card.Body className="px-4">
          <Form onSubmit={handleSubmit}>
            <h5 className="mb-3">Requester Information</h5>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="borrower_name"
                    placeholder="e.g., Juan Dela Cruz"
                    value={formData.borrower_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="e.g., example@lorma.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Date of Return
                    <OverlayTrigger
                      placement="right"
                      overlay={<Tooltip>When do you plan to return the item(s)?</Tooltip>}
                    >
                      <span className="text-muted" style={{ cursor: 'pointer' }}>?</span>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="returned_date"
                    value={formData.returned_date}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mb-3">Item Request</h5>
            <Form.Group className="mb-3">
              <Form.Label>Select Common Items</Form.Label>
              <div className="d-flex flex-wrap gap-3">
                {commonItems.map((item, idx) => (
                  <Form.Check
                    key={idx}
                    type="checkbox"
                    label={item}
                    value={item}
                    checked={selectedItems.includes(item)}
                    onChange={handleCheckboxChange}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Add Custom Items</Form.Label>
              {customItems.map((item, idx) => (
                <div key={idx} className="d-flex mb-2 align-items-center gap-2">
                  <Form.Control
                    type="text"
                    placeholder={`Custom Item ${idx + 1}`}
                    value={item.name}
                    onChange={(e) => handleCustomItemChange(idx, 'name', e.target.value)}
                  />
                  <Form.Control
                    type="number"
                    min="1"
                    placeholder="Qty"
                    style={{ maxWidth: '100px' }}
                    value={item.quantity}
                    onChange={(e) => handleCustomItemChange(idx, 'quantity', e.target.value)}
                  />
                  {idx > 0 && (
                    <Button variant="danger" size="sm" onClick={() => removeCustomItemField(idx)}>X</Button>
                  )}
                </div>
              ))}
              <Button variant="outline-secondary" size="sm" onClick={addCustomItemField}>
                + Add More
              </Button>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Purpose / Reason for Request</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Explain why you need the item(s)..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="success" type="submit" className="px-5">
                Submit Request
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request Submitted</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your request has been successfully submitted!<br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>

      <UserAssistant
        formData={formData}
        selectedItems={selectedItems}
        customItems={customItems}
      />

    </Container>
  );
}

export default RequestPage;
