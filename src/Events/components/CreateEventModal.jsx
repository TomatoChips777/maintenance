import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import FormatDate from '../../extra/DateFormat';

function CreateEventModal({
    show,
    eventName,
    startDate,
    startTime,
    endDate,
    endTime,
    preparations,
    isPersonal,
    onClose,
    onSave,
    onInputChange,
    onAddPreparation,
    onUpdatePreparation,
    onRemovePreparation
}) {
    return (
        <Modal show={show} onHide={onClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={(e) => onInputChange('eventName', e.target.value)}
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Start Date {startDate && <span className="text-muted">({FormatDate(startDate, false)})</span>}
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => onInputChange('startDate', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => onInputChange('startTime', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    End Date {endDate && <span className="text-muted">({FormatDate(endDate, false)})</span>}
                                </Form.Label>

                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => onInputChange('endDate', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => onInputChange('endTime', e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Things to Prepare </Form.Label>
                        {preparations.map((item, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center ">
                                <Form.Control
                                    type="text"
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => onUpdatePreparation(index, 'name', e.target.value)}
                                    className="me-2"
                                />
                                <Form.Control
                                    type="number"
                                    min={1}
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => onUpdatePreparation(index, 'quantity', e.target.value)}
                                    className="me-2"
                                    style={{ width: '90px' }}
                                />
                                <Button variant="danger" onClick={() => onRemovePreparation(index)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        ))}

                        {/* Add Item button now positioned at the bottom */}
                        <div className="d-flex justify-content-start mt-3">
                            <Button variant="secondary" onClick={onAddPreparation}>
                                <i className="bi bi-plus"></i> Add Item
                            </Button>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 d-flex justify-content-end align-items-center">
                        <Form.Label className="me-2 mb-0">
                            This is a personal event (only visible to me)
                        </Form.Label>
                        <Form.Check
                            type="checkbox"
                            checked={isPersonal}
                            onChange={(e) => onInputChange('isPersonal', e.target.checked)}
                            className="mb-0"
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                        />
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={onSave}>
                    Save Event
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateEventModal;
