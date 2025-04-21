// EditEventModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import { useAuth } from '../../../AuthContext';

const EditEventModal = ({ show, event, onClose, onUpdate }) => {
    const {user} = useAuth();
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [preparations, setPreparations] = useState([{ name: '', quantity: 1 }]);
    const [isPersonal, setIsPersonal] = useState(false);

    const parseLocalDateTime = (isoString) => {
        const date = new Date(isoString);
        const tzOffset = date.getTimezoneOffset(); // Get timezone offset in minutes
        date.setMinutes(date.getMinutes() - tzOffset); // Shift to local time
        return date;
    };



    useEffect(() => {
        if (event) {
            const start = new Date(event.start_datetime);
            const end = new Date(event.end_datetime);

            setEventName(event.event_name);
            setStartDate(start.toLocaleDateString('en-CA'));
            setStartTime(start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
            setEndDate(end.toLocaleDateString('en-CA'));
            setEndTime(end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
            setPreparations(event.preparations || [{ name: '', quantity: 1 }]);
            setIsPersonal(event.is_personal === 1);
        }
    }, [event]);



    const updatePreparation = (index, field, value) => {
        const updated = [...preparations];
        updated[index][field] = value;
        setPreparations(updated);
    };

    const removePreparation = (index) => {
        const updated = [...preparations];
        updated.splice(index, 1);
        setPreparations(updated);
    };

    const addPreparation = () => {
        setPreparations([...preparations, { name: '', quantity: 1 }]);
    };

    const handleSave = async () => {
        const start_datetime = `${startDate}T${startTime}`;
        const end_datetime = `${endDate}T${endTime}`;


        const start = new Date(start_datetime);
        const end = new Date(end_datetime);

        // Validation
        if (end < start) {
            alert("End time cannot be earlier than start time.");
            return;
        }
        const payload = {
            event_id: event.id, // make sure this matches your backend field
            event_name: eventName,
            start_datetime,
            end_datetime,
            is_personal: isPersonal ? 1 : 0,
            preparations: preparations.filter(p => p.name.trim() !== '')
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_EDIT_EVENT}`, payload);
            if (response.data.success) {
                onUpdate();
            } else {
                console.log(response.data.message);
            }
        } catch (err) {
            console.error("Error saving changes:", err);
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Event Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
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
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    End Date {startDate && <span className="text-muted">({FormatDate(endDate, false)})</span>}
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>End Time</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Things to Prepare </Form.Label>
                        {preparations.map((item, index) => (
                            <div key={index} className="d-flex mb-2 align-items-center">
                                <Form.Control
                                    type="text"
                                    placeholder="Item name"
                                    value={item.name}
                                    onChange={(e) => updatePreparation(index, 'name', e.target.value)}
                                    className="me-2"
                                />
                                <Form.Control
                                    type="number"
                                    min={1}
                                    placeholder="Qty"
                                    value={item.quantity}
                                    onChange={(e) => updatePreparation(index, 'quantity', e.target.value)}
                                    className="me-2"
                                    style={{ width: '90px' }}
                                />
                                <Button variant="danger" onClick={() => removePreparation(index)}>
                                    <i className="bi bi-trash"></i>
                                </Button>
                            </div>
                        ))}
                        <div className="d-flex justify-content-start mt-3">
                            <Button variant="secondary" onClick={addPreparation}>
                                <i className="bi bi-plus"></i> Add Item
                            </Button>
                        </div>
                    </Form.Group>
                    {event?.user_id === user.id && (
                    <Form.Group className="mb-3 d-flex justify-content-end align-items-center">
                        <Form.Label className="me-2 mb-0">
                        This is a personal event (only visible to me)
                        </Form.Label>
                        <Form.Check
                        type="checkbox"
                        checked={isPersonal}
                        onChange={(e) => setIsPersonal(e.target.checked)} 
                        className="mb-0"
                        style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                        />
                    </Form.Group>
                    )}

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditEventModal;
