import { Button, Modal } from "react-bootstrap";


const ArchiveAlert = ({ show, handleClose }) => {

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Archive Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <small>Are you sure to remove this report?</small>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
            <Button variant="primary" onClick={handleClose} >Close</Button>
            <Button variant="warning" onClick={()=> console.log("Archived")}>Archive</Button>
            </Modal.Footer>
            
        </Modal>

    );
};

export default ArchiveAlert;