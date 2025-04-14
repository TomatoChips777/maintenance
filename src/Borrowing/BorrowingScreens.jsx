import { useState } from 'react';
import { Container, Table, Form, Button, Row, Col, Card } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import EmailModal from './components/EmailModal';
import AddBorrowerModal from './components/AddBorrowerModal';
import ViewBorrowModal from './components/ViewBorrowModal';
import FormatDate from '../extra/DateFormat';

function BorrowingScreen() {
  const dummyData = [
    { id: 1, borrower: 'John Doe', email: 'goldengrape777@gmail.com', department: 'IT', item: 'Projector', description: 'For conference', date: '2025-04-10', status: 'Pending' },
    { id: 2, borrower: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', item: 'Laptop', description: 'Client presentation', date: '2025-04-08', status: 'Approved' },
    { id: 3, borrower: 'Sam Wilson', email: 'sam@example.com', department: 'AV', item: 'HDMI Cable', description: 'Connect projector', date: '2025-04-09', status: 'Returned' },
    { id: 4, borrower: 'Alice Brown', email: 'alice@example.com', department: 'Admin', item: 'Whiteboard', description: 'Meeting notes', date: '2025-04-11', status: 'Pending' },
    { id: 5, borrower: 'Bob Lee', email: 'bob@example.com', department: 'Graphics', item: 'Marker Set', description: 'Design sketches', date: '2025-04-12', status: 'Approved' },
    { id: 6, borrower: 'Sarah Kim', email: 'sarah@example.com', department: 'Research', item: 'Tablet', description: 'Data input', date: '2025-04-13', status: 'Returned' },
    { id: 7, borrower: 'Tom Cruz', email: 'tom@example.com', department: 'IT', item: 'Monitor', description: 'Workstation setup', date: '2025-04-14', status: 'Pending' },
    { id: 8, borrower: 'Luna Park', email: 'luna@example.com', department: 'Support', item: 'Mouse', description: 'Device replacement', date: '2025-04-14', status: 'Returned' },
    { id: 9, borrower: 'Tom Cruz', email: 'tom@example.com', department: 'IT', item: 'Monitor', description: 'Backup monitor', date: '2025-04-14', status: 'Pending' },
    { id: 10, borrower: 'Luna Park', email: 'luna@example.com', department: 'Support', item: 'Mouse', description: 'Backup device', date: '2025-04-14', status: 'Returned' },
    { id: 11, borrower: 'Luna Park', email: 'luna@example.com', department: 'Support', item: 'Mouse', description: 'Spare mouse', date: '2025-04-14', status: 'Returned' },
    { id: 12, borrower: 'Tom Cruz', email: 'tom@example.com', department: 'IT', item: 'Monitor', description: 'Testing hardware', date: '2025-04-14', status: 'Pending' },
    { id: 13, borrower: 'Luna Park', email: 'luna@example.com', department: 'Support', item: 'Mouse', description: 'For testing', date: '2025-04-14', status: 'Returned' },
  ];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);


  const [showAddModal, setShowAddModal] = useState(false);
  const [newBorrow, setNewBorrow] = useState({
    borrower: '',
    email: '',
    department: '',
    item: '',
    description: '',
    date: '',
    status: 'Pending'
  });


  const filteredData = dummyData.filter(entry => {
    const matchesSearch =
      entry.borrower.toLowerCase().includes(search.toLowerCase()) ||
      entry.item.toLowerCase().includes(search.toLowerCase()) ||
      entry.email.toLowerCase().includes(search.toLowerCase()) ||
      entry.department.toLowerCase().includes(search.toLowerCase()) ||
      entry.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || entry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
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
    try {
      const response = await fetch('http://localhost:5000/send-email', {
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
  };
  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewBorrow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = dummyData.length + 1;
    dummyData.push({ id: newId, ...newBorrow });
    setShowAddModal(false);
    setNewBorrow({ borrower: '', email: '', department: '', item: '', description: '', date: '', status: 'Pending' });
  };

  return (
    <Container className="p-0 y-0" fluid>
      <Card className='p-1'>
        <h1 className="mb-4 text-center">Borrowing Records</h1>
        {/* Filters */}
        <Row className="mb-3 p-3">

          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search borrower, item, email, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Returned">Returned</option>
            </Form.Select>
          </Col>

          <Col md={3} className="d-flex justify-content-end align-items-center">
            <Button size="lg" variant='dark' onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-circle me-2"></i> Add New
            </Button>

          </Col>

        </Row>

        {/* Table */}
        <Table striped bordered hover responsive className='mb-0'>
          <thead className='table-dark'>
            <tr>
              <th>#ID</th>
              <th>Borrower</th>
              <th>Email</th>
              <th>Department</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Description</th>
              <th>Borrow Date</th>
              <th>Returned Date</th>
              <th className='text-center'>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.borrower}</td>
                  <td>{entry.email}</td>
                  <td>{entry.department}</td>
                  <td>{entry.item}</td>
                  <td className='text-center'>100</td>
                  <td>{entry.description.length > 10
                    ? entry.description.substring(0, 10) + "..."
                    : entry.description}
                  </td>
                  <td>{FormatDate(entry.date)}</td>
                  <td>{FormatDate(entry.date)}</td>
                  <td>{entry.status}</td>
                  <td className="text-center">
                    <Button variant="info" size="sm" className="me-2 mb-1" onClick={() => openViewModal(entry)}>
                      <i className="bi bi-eye"></i>
                    </Button>

                    <Button variant="danger" size="sm" className="me-2 mb-1">
                      <i className="bi bi-trash"></i>
                    </Button>
                    <Button variant="success" size="sm " onClick={() => openEmailModal(entry)}>
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
        <Card.Footer>
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button variant="outline-dark" size="sm" onClick={handlePrev} disabled={currentPage === 1}>
                &laquo; Prev
              </Button>{' '}
              <Button variant="outline-dark" size="sm" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
                Next &raquo;
              </Button>
            </div>

            <div className="d-flex align-items-center">
              <span className="me-2">Items per page:</span>
              <Form.Select size="sm" style={{ width: '80px' }} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </Form.Select>
            </div>
          </div>
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
      />

      <AddBorrowerModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        newBorrow={newBorrow}
        handleAddChange={handleAddChange}
      />

      <ViewBorrowModal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        borrower={selectedBorrower}
      />


    </Container>
  );
}

export default BorrowingScreen;
