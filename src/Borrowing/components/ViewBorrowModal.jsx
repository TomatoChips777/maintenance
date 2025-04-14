import { Modal, Button } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';

function ViewBorrowModal({ show, onHide, borrower }) {
  if (!borrower) return null;

  return (
    <Modal show={show} onHide={onHide} centered size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>Borrowing Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>ID:</strong> {borrower.id}</p>
        <p><strong>Borrower:</strong> {borrower.borrower}</p>
        <p><strong>Email:</strong> {borrower.email}</p>
        <p><strong>Department:</strong> {borrower.department}</p>
        <p><strong>Item:</strong> {borrower.item}</p>
        <p><strong>Quantity:</strong> {borrower.item}</p>
        <p><strong>Description:</strong> {borrower.description}</p>
        <p><strong>Borrow Date:</strong> {FormatDate(borrower.date)}</p>
        <p><strong>Return Date:</strong> {FormatDate(borrower.date)}</p>
        <p><strong>Status:</strong> {borrower.status}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewBorrowModal;
