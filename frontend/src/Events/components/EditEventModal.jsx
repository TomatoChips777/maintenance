// EditEventModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import FormatDate from '../../extra/DateFormat';
import { useAuth } from '../../../AuthContext';

const EditEventModal = ({ show, event, onClose, onUpdate }) => {
    const { user } = useAuth();
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState({ hour: '12', minute: '00', ampm: 'AM' });
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState({ hour: '12', minute: '00', ampm: 'PM' });
    const [preparations, setPreparations] = useState([{ name: '', quantity: 1 }]);
    const [isPersonal, setIsPersonal] = useState(false);

    const formatToTimeObj = (timeStr) => {
        const [hourRaw, minuteRaw] = timeStr.split(':');
        let hour = parseInt(hourRaw, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return {
            hour: hour.toString(),
            minute: minuteRaw,
            ampm
        };
    };

    const convertTo24Hour = ({ hour, minute, ampm }) => {
        let h = parseInt(hour);
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${minute}`;
    };

    useEffect(() => {
        if (event) {
            const start = new Date(event.start_datetime);
            const end = new Date(event.end_datetime);
            setEventName(event.event_name);
            setStartDate(start.toISOString().split('T')[0]);
            setStartTime(formatToTimeObj(start.toTimeString().slice(0, 5)));
            setEndDate(end.toISOString().split('T')[0]);
            setEndTime(formatToTimeObj(end.toTimeString().slice(0, 5)));
            setPreparations(event.preparations || [{ name: '', quantity: 1 }]);
            setIsPersonal(event.is_personal === 1);
        }
    }, [event]);

    const handleSave = async () => {
        if (!eventName.trim()) {
            alert("Event name cannot be empty.");
            return;
        }

        const start = `${startDate}T${convertTo24Hour(startTime)}`;
        const end = `${endDate}T${convertTo24Hour(endTime)}`;

        if (new Date(end) < new Date(start)) {
            alert("End time cannot be earlier than start time.");
            return;
        }

        const payload = {
            event_id: event.id,
            event_name: eventName,
            start_datetime: start,
            end_datetime: end,
            is_personal: isPersonal ? 1 : 0,
            preparations: preparations.filter(p => p.name.trim() !== '')
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_EDIT_EVENT}`, payload);
            if (response.data.success) onUpdate();
            else console.log(response.data.message);
        } catch (err) {
            console.error("Error saving changes:", err);
        }
    };

    const renderTimeSelector = (label, timeObj, setTime) => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <div className="d-flex">
                <Form.Select
                    value={timeObj.hour}
                    onChange={(e) => setTime({ ...timeObj, hour: e.target.value })}
                    className="me-2"
                >
                    {[...Array(12)].map((_, i) => {
                        const val = (i + 1).toString();
                        return <option key={val} value={val}>{val}</option>;
                    })}
                </Form.Select>
                <Form.Select
                    value={timeObj.minute}
                    onChange={(e) => setTime({ ...timeObj, minute: e.target.value })}
                    className="me-2"
                >
                    {[...Array(60)].map((_, i) => {
                        const val = i.toString().padStart(2, '0');
                        return <option key={val} value={val}>{val}</option>;
                    })}
                </Form.Select>
                <Form.Select
                    value={timeObj.ampm}
                    onChange={(e) => setTime({ ...timeObj, ampm: e.target.value })}
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </Form.Select>
            </div>
        </Form.Group>
    );

    const updatePreparation = (index, field, value) => {
        const updated = [...preparations];
        updated[index][field] = value;
        setPreparations(updated);
    };

    const addPreparation = () => setPreparations([...preparations, { name: '', quantity: 1 }]);

    const removePreparation = (index) => {
        const updated = [...preparations];
        updated.splice(index, 1);
        setPreparations(updated);
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
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="Enter event name"
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
                            {renderTimeSelector('Start Time', startTime, setStartTime)}
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
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            {renderTimeSelector('End Time', endTime, setEndTime)}
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
