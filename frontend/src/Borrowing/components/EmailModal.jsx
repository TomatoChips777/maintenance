import { Modal, Form, Button } from 'react-bootstrap';

function EmailModal({ show, onHide, onSubmit, subject, setSubject, message, setMessage, isLoading }) {
  return (
    <Modal show={show} onHide={onHide} centered size='xl'>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">
          {isLoading ? (
              <span className="spinner-border spinner-border-sm text-white" role="status" />
            ) : (
              'Send Email'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EmailModal;
