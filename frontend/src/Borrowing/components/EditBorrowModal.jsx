import { Modal, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../AuthContext';

const departments = [
  'SDI', 'MLS', 'GenEd', 'Nursing', 'Rad Teck Pharmacy', 'Respiratory',
  'Therapy', 'Physical Therapy', 'FMO', 'Library', 'Guidance Office',
  'Research Office', "Registrar's Office", 'Student Services Office',
  'Pastoral Services', 'Clinic', 'Alumni Office'
];

function EditBorrowModal({ show, onHide, onSave, borrower, isLoading }) {
  const {user} = useAuth();
  const [customItems, setCustomItems] = useState([{ name: '', quantity: '1' }]);
  const [editedBorrower, setEditedBorrower] = useState(null);
  const formatDate = (date) => {
    if (!date) return ''; 
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); 
    const day = d.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`; 
  }
  useEffect(() => {
    if (borrower) {
      const originalReturnedDate = borrower.returned_date;
      const formattedReturnedDate = formatDate(originalReturnedDate);
  
      setEditedBorrower({
        ...borrower,
        returned_date: formattedReturnedDate, // Set the formatted date here
      });
  
      const parsedCustomItems = borrower.item_name
        ? borrower.item_name.split(', ').map(item => {
            const [name, quantity] = item.split(' (x');
            return { name: name.trim(), quantity: quantity ? quantity.replace(')', '') : '1' };
          })
        : [{ name: '', quantity: '1' }];
  
      setCustomItems(parsedCustomItems);
    } else {
      setEditedBorrower(null);
    }
  }, [borrower]);
  
  if (!editedBorrower) {
    return null;
  }

  const handleCustomItemChange = (idx, field, value) => {
    const updated = [...customItems];
    updated[idx][field] = value;
    setCustomItems(updated);
  };

  const addCustomItemField = () => {
    setCustomItems([...customItems, { name: '', quantity: '1' }]);
  };

  const removeCustomItemField = (idx) => {
    const updated = [...customItems];
    updated.splice(idx, 1);
    setCustomItems(updated);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedBorrower({
      ...editedBorrower,
      [name]: value
    });
  };

  // const internalHandleSubmit = (e) => {
  //   e.preventDefault();

  //   const allItems = customItems.map(item => {
  //     if (item.name.trim()) {
  //       return item.quantity ? `${item.name} (x${item.quantity})` : item.name;
  //     }
  //     return null;
  //   }).filter(item => item); // Remove any null entries

  //   const finalForm = {
  //     ...editedBorrower,
  //     assist_by: user.name,
  //     item_name: allItems.join(', '),
  //     customItems: customItems.map(item => `${item.name} (x${item.quantity})`)
  //   };

  //   onSave(finalForm);
  //   onHide();
  // };

  const internalHandleSubmit = (e) => {
    e.preventDefault();
  
    const allItems = customItems.map(item => {
      if (item.name.trim()) {
        return item.quantity ? `${item.name} (x${item.quantity})` : item.name;
      }
      return null;
    }).filter(item => item); // Remove any null entries
  
    // Set return date to 5 PM PH time
    const returnDate = new Date(editedBorrower.returned_date);
    returnDate.setHours(17, 0, 0, 0); // 5:00 PM local time
    const phTime = new Date(returnDate.getTime() - (returnDate.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
  
    const finalForm = {
      ...editedBorrower,
      assist_by: user.name,
      returned_date: phTime,
      item_name: allItems.join(', '),
      customItems: customItems.map(item => `${item.name} (x${item.quantity})`)
    };

    onSave(finalForm);
    onHide();
  };
  
  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Form onSubmit={internalHandleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Borrowing Record</Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-0'>
          <Card>
            <Card.Body>
              <Row className=''>
              <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Borrower Name</Form.Label>
                <Form.Control
                  type="text"
                  name="borrower_name"
                  value={editedBorrower.borrower_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              </Col>

              <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedBorrower.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              </Col>
              </Row>
              

              <Row className=''>
              <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={editedBorrower.department}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              </Col>

              <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Return Date</Form.Label>
                <Form.Control
                  type="date"
                  name="returned_date"
                  // value={editedBorrower.returned_date}
                  value={editedBorrower.returned_date || ''} 
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              </Col>
              </Row>
              {/* Add Custom Items */}
              <Form.Group className="mb-3">
                <Form.Label>Add Custom Item(s)</Form.Label>
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
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeCustomItemField(idx)}
                      >
                        X
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="sm" onClick={addCustomItemField}>
                  Add Custom Item
                </Button>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={editedBorrower.description}
                  onChange={handleChange}
                  rows={2}
                />
              </Form.Group>

              

              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={editedBorrower.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Returned">Returned</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">
          {isLoading ? (
              <span className="spinner-border spinner-border-sm text-white" role="status" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditBorrowModal;
