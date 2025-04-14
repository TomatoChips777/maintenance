import { Modal, Form, Button } from 'react-bootstrap';

function AddBorrowerModal({ show, onHide, onSubmit, newBorrow, handleAddChange }) {
  return (
    <Modal show={show} onHide={onHide} centered size='xl'>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Borrowing Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Borrower</Form.Label>
            <Form.Control name="borrower" value={newBorrow.borrower} onChange={handleAddChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={newBorrow.email} onChange={handleAddChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Department</Form.Label>
            <Form.Control name="department" value={newBorrow.department} onChange={handleAddChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Item</Form.Label>
            <Form.Control name="item" value={newBorrow.item} onChange={handleAddChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control name="description" value={newBorrow.description} onChange={handleAddChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Return Date</Form.Label>
            <Form.Control type="date" name="date" value={newBorrow.date} onChange={handleAddChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={newBorrow.status} onChange={handleAddChange}>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Returned">Returned</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Add</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddBorrowerModal;
