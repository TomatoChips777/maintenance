import { useEffect, useMemo, useState } from "react";
import { Container, Spinner, Alert, Form, Image, Row, Col } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import FormatDate from "../extra/DateFormat";
import PaginationControls from "../extra/Paginations";
import { io } from "socket.io-client";
function UserReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedReport, setExpandedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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


  useEffect(() => {
    fetchReports();
    const  socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateReports', () =>{
      fetchReports();
    });

    return () =>{
      socket.disconnect();
    };

  },[]);

 

  // Filter reports by search + status
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch =
        report.description.toLowerCase().includes(search.toLowerCase()) ||
        report.location.toLowerCase().includes(search.toLowerCase()) ||
        report.status.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  // Paginate filtered reports
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReports.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReports, currentPage, itemsPerPage]);

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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
    <Container className="mt-2">
      {/* Filters */}
      <h1>My Reports</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search reports"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={itemsPerPage} onChange={handlePageSizeChange}>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={30}>30 per page</option>
            <option value={40}>40 per page</option>
            <option value={50}>50 per page</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Report List */}
      {currentData.length === 0 ? (
        <Alert variant="info">No reports found.</Alert>
      ) : (
        <ul className="list-group">
          {currentData.map(report => (
            <li
              key={report.id}
              className="list-group-item p-4 mb-3 shadow-sm rounded-2 border-1 bg-light"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setExpandedReport(expandedReport === report.id ? null : report.id)
              }
            >
              {/* Compact Header */}
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{report.location}</span>
                <span
                  className={`badge rounded-0 ${report.status === "Pending"
                      ? "bg-warning text-dark"
                      : report.status === "In Progress"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                >
                  {report.status}
                </span>
              </div>

              {/* Expanded Details */}
              {expandedReport === report.id && (
                <div className="mt-3">
                  {report.image_path && (
                    <Image
                      src={`${import.meta.env.VITE_IMAGES}/${report.image_path}`}
                      alt="Report"
                      fluid
                      rounded
                      className="mb-3"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                  )}
                  <p>{report.description}</p>
                  <p className="text-muted small mb-1">
                    Reported on {FormatDate(report.created_at)}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <PaginationControls
        filteredReports={filteredReports}
        pageSize={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Container>
  );
}

export default UserReports;
