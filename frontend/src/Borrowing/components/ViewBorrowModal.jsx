import { Modal, Button, Row, Col } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';
import generatePDF from '../../PDF Generator/PDFGenerator';

function ViewBorrowModal({ show, onHide, borrower }) {
  if (!borrower) return null;

  const details = [
    { label: 'ID', value: borrower.id },
    { label: 'Borrower', value: borrower.borrower_name },
    { label: 'Email', value: borrower.email },
    { label: 'Department', value: borrower.department },
    { label: 'Item', value: borrower.item_name },
    { label: 'Description', value: borrower.description },
    { label: 'Borrow Date', value: FormatDate(borrower.borrow_date) },
    { label: 'Return Date', value: FormatDate(borrower.returned_date) },
    { label: 'Status', value: borrower.status },
  ];

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Borrowing Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {details.map((item, index) => (
            <Col sm={6} className="mb-3" key={index}>
              <strong>{item.label}:</strong>
              {item.label === 'Description' || item.label === 'Item' ? (
                <div
                  className="text-muted"
                  style={{
                    wordWrap: 'break-word',
                    whiteSpace: 'normal', // Allow the text to wrap
                  }}
                >
                  {item.value}
                </div>
              ) : (
                <div className="text-muted">{item.value}</div>
              )}
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="danger" onClick={() => generatePDF([borrower])}>
          <i className="bi bi-file-earmark-pdf me-2"></i> Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewBorrowModal;
