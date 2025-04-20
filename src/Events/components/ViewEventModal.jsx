import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';

function ViewEventModal({ show, event, onClose, onEdit }) {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Event Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {event && (
          <>
            <p><strong>Title:</strong> {event.title}</p>
            <p><strong>Date:</strong> {FormatDate(event.date)}</p>
            <p><strong>End at:</strong> {FormatDate(event.end_datetime)}</p>
            <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
            
            <h6>Preparations:</h6>
            <ul>
              {event.equipments.map((eq, idx) => (
                <li key={idx}>{eq.name} (x{eq.quantity})</li>
              ))}
            </ul>
            
            {/* Show whether the event is personal or not */}
            <p><strong>Event Visibility:</strong> {event.is_personal ? "Personal (only visible to you)" : "Public"}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={onEdit}>Edit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewEventModal;
