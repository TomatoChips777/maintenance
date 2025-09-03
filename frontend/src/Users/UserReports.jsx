// import { useEffect, useState } from "react";
// import { Container, Card, Spinner, Alert, Row, Col, Image, Modal, Button } from "react-bootstrap";
// import { useAuth } from "../../AuthContext";
// import axios from "axios";
// import FormatDate from "../extra/DateFormat";
// import TextTruncate from "../extra/TextTruncate";

// function UserReports() {
//     const { user } = useAuth();
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [selectedReport, setSelectedReport] = useState(null);

//     useEffect(() => {
//         const fetchReports = async () => {
//             try {
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_GET_REPORTS_BY_ID}/${user?.id}`
//                 );
//                 setReports(response.data.reports);
//             } catch (err) {
//                 setError("Failed to load reports.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (user?.id) {
//             fetchReports();
//         }
//     }, [user]);

//     if (loading) {
//         return (
//             <div className="text-center mt-5">
//                 <Spinner animation="border" variant="success" />
//             </div>
//         );
//     }

//     if (error) {
//         return <Alert variant="danger" className="mt-3">{error}</Alert>;
//     }

//     return (
//         <Container className="mt-4">
//             {reports.length === 0 ? (
//                 <Alert variant="info">You haven’t submitted any reports yet.</Alert>
//             ) : (
//                 <Row xs={1} md={2} lg={3} className="g-4">
//                     {reports.map((report) => (
//                         <Col key={report.id}>
//                             <Card
//                                 className="shadow-sm h-100 report-card"
//                                 style={{ cursor: "pointer" }}
//                                 onClick={() => setSelectedReport(report)}
//                             >
//                                 {report.image_path && (
//                                     <Image
//                                         src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
//                                         alt="Report"
//                                         fluid
//                                         className="card-img-top"
//                                         style={{ maxHeight: "200px", objectFit: "cover" }}
//                                     />
//                                 )}
//                                 <Card.Body>
//                                     <Card.Title className="fw-semibold"><TextTruncate text={report.location} maxLength={30} /></Card.Title>
//                                     <Card.Text><TextTruncate text={report.description} maxLength={50} /></Card.Text>
//                                     <div className="text-muted small">
//                                         Reported on {FormatDate(report.created_at)}
//                                     </div>
//                                     <div className="mt-2">
//                                         <span
//                                             className={`rounded-0 badge ${report.status === "Pending"
//                                                     ? "bg-warning text-dark"
//                                                     : report.status === "In Progress"
//                                                         ? "bg-primary"
//                                                         : "bg-success"
//                                                 }`}
//                                         >
//                                             {report.status}
//                                         </span>
//                                     </div>
//                                 </Card.Body>
//                             </Card>
//                         </Col>
//                     ))}
//                 </Row>
//             )}

//             {/* Report Details Modal */}
//             <Modal
//                 show={!!selectedReport}
//                 onHide={() => setSelectedReport(null)}
//                 size="lg"
//                 centered
//             >
//                 <Modal.Header closeButton>
//                     <Modal.Title>Report Details</Modal.Title>
//                 </Modal.Header>
//                 {selectedReport && (
//                     <Modal.Body>
//                         {selectedReport.image_path && (
//                             <Image
//                                 src={`${import.meta.env.VITE_IMAGES}/${selectedReport.image_path}`}
//                                 alt="Report"
//                                 fluid
//                                 className="mb-3"
//                                 style={{ maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
//                             />
//                         )}
//                         <h5 className="fw-bold">{selectedReport.location}</h5>
//                         <p>{selectedReport.description}</p>
//                         <p className="text-muted small">
//                             Reported on {FormatDate(selectedReport.created_at)}
//                         </p>
//                         <p>
//                             <strong>Status: </strong>
//                             <span
//                                 className={`rounded-0 badge ${selectedReport.status === "Pending"
//                                         ? "bg-warning text-dark"
//                                         : selectedReport.status === "In Progress"
//                                             ? "bg-primary"
//                                             : "bg-success"
//                                     }`}
//                             >
//                                 {selectedReport.status}
//                             </span>
//                         </p>
//                     </Modal.Body>
//                 )}
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setSelectedReport(null)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// }

// export default UserReports;

import { useEffect, useState } from "react";
import { Container, Card, Spinner, Alert, Row, Col, Image, Modal, Button } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import FormatDate from "../extra/DateFormat";
import TextTruncate from "../extra/TextTruncate";

function UserReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_GET_REPORTS_BY_ID}/${user?.id}`
        );
        setReports(response.data.reports);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      {reports.length === 0 ? (
        <Alert variant="info">You haven’t submitted any reports yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {reports.map((report) => (
            <Col key={report.id}>
              <Card
                className="shadow-sm h-100 report-card"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedReport(report)}
              >
                {report.image_path ? (
                  <Image
                    src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                    alt="Report"
                    fluid
                    className="card-img-top"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "200px" }}
                  >
                    <span className="text-muted">No Image</span>
                  </div>
                )}
                <Card.Body>
                  <Card.Title className="fw-semibold">
                    <TextTruncate text={report.location} maxLength={30} />
                  </Card.Title>
                  <Card.Text>
                    <TextTruncate text={report.description} maxLength={50} />
                  </Card.Text>
                  <div className="text-muted small">
                    Reported on {FormatDate(report.created_at)}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`rounded-0 badge ${
                        report.status === "Pending"
                          ? "bg-warning text-dark"
                          : report.status === "In Progress"
                          ? "bg-primary"
                          : "bg-success"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Report Details Modal */}
      <Modal
        show={!!selectedReport}
        onHide={() => setSelectedReport(null)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        {selectedReport && (
          <Modal.Body>
            {selectedReport.image_path && (
              <Image
                src={`${import.meta.env.VITE_IMAGES}/${selectedReport.image_path}`}
                alt="Report"
                fluid
                className="mb-3"
                style={{
                  maxHeight: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}
            <h5 className="fw-bold mb-2">{selectedReport.location}</h5>

            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                padding: "8px",
                border: "1px solid #dee2e6",
                borderRadius: "0.25rem",
                backgroundColor: "#f8f9fa",
                marginBottom: "12px",
              }}
            >
              {selectedReport.description}
            </div>

            <p className="text-muted small mb-1">
              Reported on {FormatDate(selectedReport.created_at)}
            </p>

            <p>
              <strong>Status: </strong>
              <span
                className={`rounded-0 badge ${
                  selectedReport.status === "Pending"
                    ? "bg-warning text-dark"
                    : selectedReport.status === "In Progress"
                    ? "bg-primary"
                    : "bg-success"
                }`}
              >
                {selectedReport.status}
              </span>
            </p>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedReport(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UserReports;
