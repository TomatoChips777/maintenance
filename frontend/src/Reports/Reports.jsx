import { userEffect, useMemo, useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Table } from 'react-bootstrap';
import PaginationControls from '../extra/Paginations';
import ViewReport from './components/ViewReport';
import CreateReport from './components/CreateReport';
import ArchiveAlert from './components/ArchiveAlert';
import axios from 'axios';
import FormatDate from '../extra/DateFormat';
import TextTruncate from '../extra/TextTruncate';

function Reports() {
    const [reports, setReports] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [priorityFilter, setPriorityFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedReport, setSelectedReport] = useState('');
    //fetch reports
    const fetchReports = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_GET_REPORTS}`);
            setReports(response.data);

        } catch (error) {
            console.log("Error fetching reports:", error);
        }
    }

    const filteredReports = useMemo(() => {
        return reports.filter(report => {
            const matchesSearch =
                report.description.toLowerCase().includes(search.toLowerCase()) ||
                report.location.toLowerCase().includes(search.toLowerCase()) ||
                report.reporter_name.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
            const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [reports, search, statusFilter, priorityFilter]);


    const currentData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredReports.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredReports, currentPage, itemsPerPage]);

    useEffect(() => {
        fetchReports();
    }, []);

    const handleOpenViewModal = (report) => {
        setSelectedReport(report);
        setShowViewModal(true)
    };
    const handleCloseViewModal = () => {
        setShowViewModal(false);
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleStatusChange = async (e, report) =>{
        const newStatus = e.target.value;

        // if(report.status==)
    }

    const handlePageSizeChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };
    return (
        <Container fluid className='p-0'>
            <Card className='p-1'>

                <h1 className='mb-4 text-center'>
                    Reports List
                </h1>
                <Row className="mb-3 p-3 align-items-end">
                    {/* Search */}
                    <Col md={4}>
                        <Form.Group controlId="searchReports">
                            <Form.Label>Search</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search Reports"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </Form.Group>
                    </Col>

                    {/* Status Filter */}
                    <Col md={3}>
                        <Form.Group controlId="filterStatus">
                            <Form.Label>Filter By Status</Form.Label>
                            <Form.Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* Priority Filter */}
                    <Col md={3}>
                        <Form.Group controlId="filterPriority">
                            <Form.Label>Filter By Priority</Form.Label>
                            <Form.Select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    {/* New Report Button */}
                    <Col md={2} className="d-flex justify-content-end">
                        <Button variant="dark" onClick={handleOpenCreateModal}>
                            <i className="bi bi-plus-circle me-2"></i>
                            New Report
                        </Button>
                    </Col>
                </Row>

                <Table striped bordered hover responsive className='mb-0'>

                    <thead className='table-dark'>
                        <tr>
                            <th>Date</th>
                            <th>Reported By</th>
                            <th>Location</th>
                            <th>Description</th>
                            <th className='text-center'>Priority</th>
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length > 0 ? (
                            currentData.map(report => (
                                <tr key={report.id}>
                                    <td>{FormatDate(report.created_at)}</td>
                                    <td>{report.reporter_name}</td>
                                    <td><TextTruncate text={report.location} maxLength={30} /></td>
                                    <td><TextTruncate text={report.description} maxLength={50} /></td>
                                    <td>{report.priority}</td>
                                    {/* <td className='text-center'>{report.status}</td> */}
                                    <td className='text-center'>
                                    <Form.Select value={report.status}
                                    onChange={(e) => handleStatusChange(e, report)}
                                    >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    </Form.Select>
                                    </td>
                                    <td className='text-center'>
                                        <Button variant='info' size='sm' className='me-2' onClick={() => handleOpenViewModal(report)}>
                                            <i className='bi bi-eye'></i>
                                        </Button>
                                        <Button variant='danger' size='sm' onClick={() => handleShowAlert()}>
                                            <i className='bi bi-trash'></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))

                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No records found.</td>
                            </tr>
                        )}

                    </tbody>

                </Table>

                <PaginationControls
                    filteredReports={filteredReports}
                    pageSize={itemsPerPage}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    handlePageSizeChange={handlePageSizeChange}
                />

                <ViewReport
                    show={showViewModal}
                    handleClose={handleCloseViewModal}
                    report={selectedReport}
                />

                <CreateReport
                    show={showCreateModal}
                    handleClose={handleCloseCreateModal}
                />

                <ArchiveAlert
                    show={showAlert}
                    handleClose={handleCloseAlert}
                />

            </Card>

        </Container>

    )

};

export default Reports;

