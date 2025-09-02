import { Modal, Button, Form } from 'react-bootstrap';


const ViewReport = ({ show, handleClose, report }) => {
    console.log(report);
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Viewing Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            Date
                        </Form.Label>
                        <Form.Control type='text' value={report?.date} disabled>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>
                            Reported By
                        </Form.Label>
                        <Form.Control
                            type='text'
                            name='reporter-name'
                            value={report?.reportedBy}
                            disabled
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Location</Form.Label>
                        <Form.Control type='text' name='location' value={report?.location} disabled>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={5} name='description' value={report?.description} disabled></Form.Control>
                    </Form.Group>

                </Form>
                <Button variant="primary" size='sm' onClick={handleClose}> Close

                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ViewReport;