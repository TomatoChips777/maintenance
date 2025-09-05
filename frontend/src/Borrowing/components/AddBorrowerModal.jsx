import { Modal, Form, Button, Card } from 'react-bootstrap';
import { useState } from 'react';

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

function AddBorrowerModal({ show, onHide, onSubmit, newBorrow, handleAddChange,isLoading }) {
  const [selectedCommonItems, setSelectedCommonItems] = useState([]);
  const [customItems, setCustomItems] = useState([{ name: '', quantity: '1' }]);

  const handleCommonItemCheck = (e) => {
    const value = e.target.value;
    setSelectedCommonItems((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

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



  const internalHandleSubmit = (e) => {
    e.preventDefault();

    const allItems = [...selectedCommonItems];

    customItems.forEach(item => {
      if (item.name.trim()) {
        const itemStr = item.quantity ? `${item.name} (x${item.quantity})` : item.name;
        allItems.push(itemStr);
      }
    });

    // const dateOnly = new Date(newBorrow.returned_date);
    // dateOnly.setHours(17, 0, 0, 0); 

    // const phTime = new Date(
    //   dateOnly.getTime() - (dateOnly.getTimezoneOffset() * 60000)
    // ).toISOString().slice(0, 19).replace('T', ' ');



    const finalForm = {
      ...newBorrow,
      // returned_date: phTime, // store with time
      item: allItems.join(', ')
    };

    // const finalForm = {
    //   ...newBorrow,
    //   item: allItems.join(', ') 
    // };

    onSubmit(finalForm);


    setSelectedCommonItems([]);
    setCustomItems([{ name: '', quantity: '' }]);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Form onSubmit={internalHandleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Borrowing Record</Modal.Title>
        </Modal.Header>

        <Modal.Body className='p-0'>
          <Card>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Borrower Name</Form.Label>
                <Form.Control
                  type="text"
                  name="borrower_name"
                  value={newBorrow.borrower_name}
                  onChange={handleAddChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={newBorrow.email}
                  onChange={handleAddChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={newBorrow.department}
                  onChange={handleAddChange}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Select Common Items */}
              <Form.Group className="mb-3">
                <Form.Label>Select Common Items</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {commonItems.map((item, idx) => (
                    <Form.Check
                      key={idx}
                      type="checkbox"
                      label={item}
                      value={item}
                      checked={selectedCommonItems.includes(item)}
                      onChange={handleCommonItemCheck}
                    />
                  ))}
                </div>
              </Form.Group>

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
                  value={newBorrow.description}
                  onChange={handleAddChange}
                  rows={2}
                />
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
              'Add'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddBorrowerModal;
