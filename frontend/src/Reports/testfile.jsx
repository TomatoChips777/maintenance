import { userEffect, useMemo, useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button, Table } from 'react-bootstrap';
import PaginationControls from '../extra/Paginations';
import ViewReport from './components/ViewReport';
import CreateReport from './components/CreateReport';
import ArchiveAlert from './components/ArchiveAlert';
import axios from 'axios';

function Reports() {
    const [reports, setReports] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    //fetch reports
    const fetchReports = async () =>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_GET_REPORTS}`);
            setReports(response.data);
        }catch(error){
            console.log("Error fetching reports:", error);
        }
    }
    const fetchReports2 = async () =>{
       try{
        const response = await axios.get(`${import.meta.env.VITE_GET_REPORTS}`);
        setReports(response.data);
       }catch(error){
        console.log("Error fetching reports:", error);
       }
    }

    useEffect(() =>{
        fetchReports();
    }, []);

    const handleOpenViewModal=()=>{
        setShowViewModal(true)
    }
    const handleCloseViewModal=()=>{
        setShowViewModal(false);
    }

    const handleOpenCreateModal=()=>{
        setShowCreateModal(true);
    }
    const handleCloseCreateModal=()=>{
        setShowCreateModal(false);
    }
    const handleShowAlert=()=>{
        setShowAlert(true);
    }
    const handleCloseAlert=()=>{
        setShowAlert(false);
    }

    return (
        <Container fluid className='p-0'>
            <Card className='p-1'>

                <h1 className='mb-4 text-center'>
                    Reports List
                </h1>

                <Row className="mb-3 p-3">
                    <Col md={4}>
                        <Form.Control
                            type='text'
                            placeholder="Search Reports"
                        />
                    </Col>

                    <Col md={2}>
                        <Form.Select>
                            <option value="All">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="">Resolved</option>
                        </Form.Select>
                    </Col>
                    <Col md={2}>
                    <Form.Select>
                        <option value="All">All</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                    </Form.Select>
                    </Col>
                    <Col md={4} className='d-flex justify-content-end align-items-center'>
                        <Button variant="dark" onClick={()=> handleOpenCreateModal()}>
                            <i className='bi bi-plus-circle me-2'></i>
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
                            <th className='text-center'>Status</th>
                            <th className='text-center'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        <tr>
                            <td>.....</td>
                            <td>.....</td>
                            <td>.....</td>
                            <td>.....</td>
                            <td>.....</td>
                            <td className='text-center'>
                                <Button variant='info' size='sm' className='me-2' onClick={()=> handleOpenViewModal()}>
                                    <i className='bi bi-eye'></i>
                                </Button>
                                <Button variant='danger' size='sm' onClick={()=> handleShowAlert()}>
                                    <i className='bi bi-trash'></i>
                                </Button>
                            </td>
                        </tr>
                    </tbody>

                </Table>

                <PaginationControls
                filteredReports={10}
                pageSize={10}
                currentPage={0}
                setCurrentPage={0}
                // handlePageSizeChange={on}
                />

                <ViewReport 
                show={showViewModal}
                handleClose={handleCloseViewModal}
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

