import { useEffect, useState, useMemo } from 'react';
import { Container, Table, Form, Button, Row, Col, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import EmailModal from './components/EmailModal';
import AddBorrowerModal from './components/AddBorrowerModal';
import ViewBorrowModal from './components/ViewBorrowModal';
import FormatDate from '../extra/DateFormat';
import generatePDF from '../PDF Generator/PDFGenerator';
import TextTruncate from '../extra/TextTruncate';
import EditBorrowModal from './components/EditBorrowModal';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { io } from 'socket.io-client';
import PaginationControls from '../extra/Paginations';

function BorrowingScreen() {
  const { user } = useAuth();
  const [borrowData, setBorrowData] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [overdueFilter, setOverdueFilter] = useState(false);

  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sentLoading, setSentLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBorrow, setNewBorrow] = useState({
    borrower_name: '',
    email: '',
    department: '',
    item: '',
    description: '',
    borrow_date: '',
    returned_date: '',
    assist_by: '',
    status: 'Pending'
  });




  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_BORROW_ITEMS}`);
      setBorrowData(response.data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchData();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateBorrowing', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };

  }, []);

  const isOverdue = (returnedDate, status) => {
    if (!returnedDate || status === 'Returned') return false;

    const now = new Date();
    const due = new Date(returnedDate);

    // We only care if it's PAST the due date
    return now > due;
  };

  const filteredData = useMemo(() => {
    return borrowData.filter(entry => {
      const matchesSearch =
        entry.borrower_name.toLowerCase().includes(search.toLowerCase()) ||
        entry.item_name.toLowerCase().includes(search.toLowerCase()) ||
        entry.email.toLowerCase().includes(search.toLowerCase()) ||
        entry.department.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;

      const matchesOverdue = !overdueFilter || isOverdue(entry.returned_date, entry.status);

      return matchesSearch && matchesStatus && matchesOverdue;
    });
  }, [borrowData, search, statusFilter, overdueFilter]);


  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Inside Parent Component
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentBorrower, setCurrentBorrower] = useState(null);

  const handleEdit = (borrower) => {
    setCurrentBorrower(borrower);
    setShowEditModal(true);
  };

  const handleSave = async (updatedBorrower) => {
    setSentLoading(false);
    try {
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_ITEM}/${updatedBorrower.id}`, updatedBorrower);

      if (response.data.success) {
        setShowEditModal(false);
        setCurrentPage(currentPage);
      } else {
        alert('Failed to update borrow record.');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating the record.');
    }
    setSentLoading(false);
  };
  
  const openEmailModal = (entry) => {
    setSelectedBorrower(entry);
    setShowEmailModal(true);
    setSubject('');
    setMessage('');
  };

  const openViewModal = (entry) => {
    setSelectedBorrower(entry);
    setShowViewModal(true);
  };


  const sendEmail = async (e) => {
    e.preventDefault();
    setSentLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SEND_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: selectedBorrower.email,
          subject,
          message
        }),
      });

      if (response.ok) {
        alert('Email sent successfully!');
        setShowEmailModal(false);
        setSelectedBorrower(null);
        
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert('Failed to send email.');
    }
    setSentLoading(false);
  };
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewBorrow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (borrowData) => {
    setSentLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_CREATE_BORROW_ITEM}`, {
        borrower_name: borrowData.borrower_name,
        email: borrowData.email,
        department: borrowData.department,
        item_name: borrowData.item,
        description: borrowData.description,
        returned_date: borrowData.returned_date || null,
        assist_by: user.name,
      });

      if (response.data.success) {
        setCurrentPage(currentPage);
        console.log('Borrow added:', response.data.message);
        setNewBorrow({
          borrower_name: '',
          email: '',
          department: '',
          item: '',
          description: '',
          borrow_date: '',
          returned_date: '',
          assist_by: ''
        });

        setShowAddModal(false);
      } else {
        console.error('Failed to add:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting borrow:', error);
    }
    setSentLoading(false);
  };

  const handleStatusChange = async (e, entry) => {
    const newStatus = e.target.value;


    if (entry.status === 'Returned' && newStatus !== 'Returned') {
      const confirmChange = window.confirm('This item has already been returned. Do you want to change its status?');
      if (!confirmChange) {
        return;
      }
    }
    try {
      const updatedBorrower = { ...entry, status: newStatus, assist_by: user.name };
      const response = await axios.put(`${import.meta.env.VITE_UPDATE_BORROW_ITEM_STATUS}/${entry.id}`, updatedBorrower);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating the status.');
    }
  };

  const handlePageSizeChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 when page size changes
  };

  return (
    <Container className="p-0 y-0" fluid>
      <Card className='p-1'>
        <h1 className="mb-4 text-center">Borrowing Records</h1>
        {/* Filters */}
        <Row className="mb-3 p-3">

          <Col md={5}>
            <Form.Control
              type="text"
              placeholder="Search borrower, item, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Returned">Returned</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Check
              type="checkbox"
              label="Overdue Only"
              checked={overdueFilter}
              onChange={(e) => setOverdueFilter(e.target.checked)}
            />
          </Col>
          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button size="" variant='dark' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add New
            </Button>

            <Button size="" variant='outline-danger' className='ms-2' onClick={() => generatePDF(borrowData)}>
              <i className="bi bi-file-earmark-pdf me-2"></i> Download PDF
            </Button>
          </Col>
        </Row>
        {loading ? (
          <div className="text-center py-5">
            <span className="spinner-border text-dark" role="status" />
          </div>
        ) : (
          <Table striped bordered hover responsive className='mb-0'>
            <thead className='table-dark'>
              <tr>
                <th>#ID</th>
                <th>Borrower</th>
                <th>Email</th>
                <th>Department</th>
                <th>Item</th>
                <th>Description</th>
                <th>Borrow Date</th>
                <th>Returned Date</th>
                <th>Assist By</th>
                <th className='text-center'>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map(entry => (
                  <tr key={entry.id} className={isOverdue(entry.returned_date, entry.status) ? 'table-danger' : ''}>
                    <td>{entry.id}</td>
                    <td>{entry.borrower_name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.department}</td>
                    <td><TextTruncate text={entry.item_name} maxLength={10} /></td>
                    <td><TextTruncate text={entry.description} maxLength={10} /></td>
                    <td>{FormatDate(entry?.borrow_date)}</td>
                    <td>{entry.returned_date ? FormatDate(entry.returned_date) : 'N/A'}</td>
                    <td>{entry.assisted_by}</td>
                    {/* <td>{entry.status}</td> */}
                    <td className="text-center">
                      <Form.Select
                        value={entry.status}
                        onChange={(e) => handleStatusChange(e, entry)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Returned">Returned</option>
                      </Form.Select>
                    </td>

                    <td className="text-center">
                      <Button variant="info" size="sm" className="me-2 mb-1" onClick={() => openViewModal(entry)}>
                        <i className="bi bi-eye"></i>
                      </Button>

                      <Button variant="warning" size="sm " className="me-2 mb-1" onClick={() => handleEdit(entry)}>
                        <i className="bi bi-pencil"></i>
                      </Button>

                      <Button variant="danger" size="sm" className="me-2 mb-1">
                        <i className="bi bi-trash"></i>
                      </Button>

                      <Button variant="success" size="sm " className="me-2 mb-1" onClick={() => openEmailModal(entry)}>
                        <i className="bi bi-envelope-fill"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">No records found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
        <Card.Footer>
          <PaginationControls
            filteredReports={filteredData}
            pageSize={itemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handlePageSizeChange={handlePageSizeChange}
          />
        </Card.Footer>
      </Card>

      {/* Email Modal */}
      <EmailModal
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        onSubmit={sendEmail}
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
        isLoading={sentLoading}
      />

      <AddBorrowerModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newBorrow={newBorrow}
        handleAddChange={handleAddChange}
        isLoading={sentLoading}
      />

      <ViewBorrowModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        borrower={selectedBorrower}
      />
      <EditBorrowModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        borrower={currentBorrower}
        onSave={handleSave}
        isLoading={sentLoading}
      />
    </Container>
  );
}

export default BorrowingScreen;
