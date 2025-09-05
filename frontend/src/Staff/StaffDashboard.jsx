import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Card, Modal, Image } from "react-bootstrap";
import FormatDate from "../extra/DateFormat";

function StaffDashboard() {
    const [reports, setReports] = useState([]);
    const [expandedReport, setExpandedReport] = userState(null);
    const fetchReports = async () => {
        try {
            const response = await (`${import.meta.env.VITE_GET_REPORTS}`);
            setReports(response.data.reports);
        } catch (e) {
            console.log("Error fetching reports:", e);
        }
    }

    useEffect(() => {
        fetchReports();
    }, [])

    return (
        <>
            <Container>
                <Card>
                    <Card.Header>
                        <Card.Title>
                            My Task
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <ul className="list-group">
                            {reports.map(report =>{
                                <li key={report.id} className="list-group-item p-4 mb-3 shadow-sm rounded-3 border-1 bg-white">
                                    
                                    <div className="d-flex justify-content-between align-items-center">

                                    <div>
                                        <h5 className="mb-1 fw-bold">{report.location}</h5>
                                        <small className="text-muted">
                                            Reported on {FormatDate(report.create_at)}
                                        </small>
                                    </div>
                                    <span className={`badge px-3 py-2 fs-6 ${report.status === "Pending" 
                                        ? "bg-warning text-dark" : report.status === "In Progress" 
                                        ? "bg-primary"
                                        : "bg-success"
                                    }`}>
                                        {report.status}
                                    </span>
                                    </div>

                                    <p className="mt-2 text-truncate" style={{ maxWidth: "80%"}}>
                                        {report.description}
                                    </p>

                                    <div className="text-end">
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => setExpandedReport(report)}>
                                            View Details
                                        </button>
                                    </div>
                                </li>
                            })}
                        </ul>
                        {
                            expandedReport && (
                                <Modal show onHide={() => setExpandedReport(null)} size="xl">
                                    <Modal.Header closeButton>
                                <Modal.Title>Report Details</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {expandedReport.image_path && (
                                            <Image
                                            src={`${import.meta.env.VITE_IMAGES}/${expandedReport.image_path}`}
                                            alt="Report"
                                            fluid
                                            rounded
                                            className="mb-3 border"
                                            style={{ maxHeight  : "300px", objectFit: 'cover'}}
                                            />
                                        )}
                                    <h5>{expandedReport.location}</h5>
                                    <p>{expandedReport.description}</p>
                                    <p className="text-muted">
                                        Reported On {FormatDate(expandedReport.created_at)}
                                    </p>
                                    </Modal.Body>
                                    <Modal.Button>
                                        <button className="btn btn-secondary"
                                        onClick={() => setExpandedReport(null)}>
                                            Close
                                        </button>
                                    </Modal.Button>
                                </Modal>
                            )
                        }
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default StaffDashboard;