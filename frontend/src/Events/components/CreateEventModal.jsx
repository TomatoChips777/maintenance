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
    // Get the current date
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format

    // Function to check if the start date is in the past
    const isStartDateInvalid = startDate && startDate < currentDate;

    // Function to check if end date is earlier than the start date or if start time is equal to end time
    const isDateOrTimeInvalid = () => {
        if (!startDate || !endDate || !startTime || !endTime) return false;

        // Check if the end date is earlier than the start date
        if (endDate < startDate) return true;

        // If start date and end date are the same, check if start time and end time are the same
        if (startDate === endDate) {
            const startTimeStr = `${startTime.hour}:${startTime.minute} ${startTime.ampm}`;
            const endTimeStr = `${endTime.hour}:${endTime.minute} ${endTime.ampm}`;
            return startTimeStr === endTimeStr; // Check if start time equals end time
        }
        
        return false; // If none of the conditions are met, return false
    };

    const renderTimeSelector = (label, timeObj, onChange) => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <div className="d-flex">
                <Form.Select
                    value={timeObj.hour}
                    onChange={(e) => onChange({ ...timeObj, hour: e.target.value })}
                    className="me-2"
                >
                    {[...Array(12)].map((_, i) => {
                        const val = (i + 1).toString();
                        return <option key={val} value={val}>{val}</option>;
                    })}
                </Form.Select>
                <Form.Select
                    value={timeObj.minute}
                    onChange={(e) => onChange({ ...timeObj, minute: e.target.value })}
                    className="me-2"
                >
                    {[...Array(60)].map((_, i) => {
                        const val = i.toString().padStart(2, '0');
                        return <option key={val} value={val}>{val}</option>;
                    })}
                </Form.Select>
                <Form.Select
                    value={timeObj.ampm}
                    onChange={(e) => onChange({ ...timeObj, ampm: e.target.value })}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </Form.Select>
            </div>
        </Form.Group>
    );

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
                                {isStartDateInvalid && (
                                    <div className="text-danger mt-2">Start date cannot be in the past</div>
                                )}
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            {renderTimeSelector('Start Time', startTime, (val) => onInputChange('startTime', val))}
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
                            {renderTimeSelector('End Time', endTime, (val) => onInputChange('endTime', val))}
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Things to Prepare</Form.Label>
                        {preparations.map((item, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center">
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
                <Button
                    variant="primary"
                    onClick={onSave}
                    disabled={isStartDateInvalid || isDateOrTimeInvalid()} // Disable button if validations fail
                >
                    Save Event
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateEventModal;
