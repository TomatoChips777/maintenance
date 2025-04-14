import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function RequestPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    category: '',
    item: '',
    quantity: '',
    returnDate: '',
    reason: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Request submitted:', formData);
    setSubmitted(true);
    // You can send this to your backend here
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Item Request Form</h2>

      {submitted && (
        <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
          Your request has been submitted!
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                placeholder="e.g. IT, HR, Marketing"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationery">Stationery</option>
                <option value="Tools">Tools</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                name="item"
                placeholder="Enter item name"
                value={formData.item}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                min="1"
                placeholder="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Date to Return</Form.Label>
              <Form.Control
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-4">
          <Form.Label>Reason</Form.Label>
          <Form.Control
            as="textarea"
            name="reason"
            rows={3}
            placeholder="Briefly explain why you need this item"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit" className="px-5">
            Submit Request
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default RequestPage;
