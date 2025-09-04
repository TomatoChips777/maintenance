import { Button, Modal } from "react-bootstrap";
import axios from "axios";

const ArchiveAlert = ({ show, handleClose, report }) => {
  const handleArchiveReport = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_ARCHIVE_REPORT}/${report.id}`
      );

      // If backend responds with success
      if (response.status === 200 && response.data?.success) {
        console.log("Report archived successfully");
        handleClose();
      } else {
        console.warn("Failed to archive:", response.data);
      }
    } catch (error) {
      console.error("Error archiving report:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Archive Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <small>Are you sure you want to archive this report?</small>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="warning" onClick={handleArchiveReport}>
          Archive
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArchiveAlert;
