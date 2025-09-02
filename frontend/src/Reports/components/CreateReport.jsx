import { useState } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
const CreateReport = ({ show, handleClose }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_id: user.id,
        location: '',
        category: '',
        priority: '',
        assigned_staff: '',
        status: '',
        image: null,
        description: '',

    });

    const resetForm = () => {
        setFormData({
            user_id: user.id,
            location: '',
            category: '',
            priority: '',
            assigned_staff: '',
            status: '',
            image: null,
            description: '',
        })
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();

        Object.entries({ ...formData, user_id: user?.id }).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                formDataObj.append(key, value);
            }
        });


        try {
            const response = await axios.post(`${import.meta.env.VITE_CREATE_REPORT}`, formDataObj, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                handleClose();
                resetForm();
            }
        } catch (error) {
            console.log("Error creating report:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    New Report
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-3'>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type='text' name='location' value={formData.location} onChange={handleInputChange} required></Form.Control>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select name='category' value={formData.category} onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Cleaning">Cleaning</option>
                            <option value="General Repair">General Repair</option>
                            <option value="Other">Other</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Priority</Form.Label>
                        <Form.Select name='priority' value={formData.priority} onChange={handleInputChange} required>
                            <option value="">Select Priority</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Urgent">Urgent</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Assigned Staff</Form.Label>
                        <Form.Control type='text' name='assigned_staff' value={formData.assigned_staff} onChange={handleInputChange}></Form.Control>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Status</Form.Label>
                        <Form.Select name='status' value={formData.status} onChange={handleInputChange} required>
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control type='file' accept='image/*' onChange={handleFileChange}></Form.Control>
                    </Form.Group>

                    <Form.Group className='mb-3'><Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={4} name='description' value={formData.description} onChange={handleInputChange} required>

                        </Form.Control>
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Button variant='primary' onClick={handleClose}>Close</Button>
                        <Button variant="dark" type="submit" disabled={loading}>
                            {loading ? <Spinner animation='border' size='sm' /> : 'Submit'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateReport;