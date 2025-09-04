import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Accordion, Spinner } from 'react-bootstrap';
import ChatWidget from '../Chatbot/ChatWidget';
import axios from 'axios';
import FormatDate from '../extra/DateFormat';
import TextTruncate from '../extra/TextTruncate';
import CreateEventModal from '../Events/components/CreateEventModal';
import { io } from 'socket.io-client';
import Charts from './components/Charts';
import { useAuth } from '../../AuthContext';
import {
  formatAssistFrequency,
  formatBorrowersRanking, formatBorrowingFrequencyText,
  formatEvents, formatQuickStats
} from './components/Formatted';
import { ChatSquareQuoteFill } from 'react-bootstrap-icons';
import DashboardInventoryCard from './components/DashboardInventoryCard';
const Dashboard = ({ handleAskButton }) => {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assistFrequency, setAssistFrequency] = useState([]);
  const [borrowersData, setBorrowersData] = useState([]);

  const [inventoryPage, setInventoryPage] = useState(1);
  const itemsPerPage = 5;

  const [borrowingsPage, setBorrowingsPage] = useState(1);
  const borrowingsPerPage = 5;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    eventName: '',
    startDate: '',
    startTime: { hour: '8', minute: '00', ampm: 'AM' },
    endDate: '',
    endTime: { hour: '9', minute: '00', ampm: 'AM' },
    preparations: [],
    isPersonal: false,
  });

  const formatTo24Hour = ({ hour, minute, ampm }) => {
    let h = parseInt(hour);
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${minute}`;
  };


  const fetchData = async () => {
    axios.get(`${import.meta.env.VITE_DASHBOARD_DATA}/${user.id}`)
      .then(res => {
        setInventoryData(res.data.inventory || []);
        setUpcomingEvents(res.data.upcomingEvents || []);
        setOngoingEvents(res.data.ongoingEvents || []);
        setBorrowings(res.data.reportFrequencyResult || []);
        setQuickStats(res.data.quickStats || []);
        setBorrowersData(res.data.borrowersRanking || []);
        setAssistFrequency(res.data.assistFrequency || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchData();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('update', () => {
      fetchData();
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  const handleInputChange = (key, value) => {
    setEventForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddPreparation = () => {
    setEventForm(prev => ({
      ...prev,
      preparations: [...prev.preparations, { name: '', quantity: 1 }]
    }));
  };

  const handleUpdatePreparation = (index, key, value) => {
    const updated = [...eventForm.preparations];
    updated[index][key] = value;
    setEventForm(prev => ({ ...prev, preparations: updated }));
  };

  const handleRemovePreparation = (index) => {
    const updated = [...eventForm.preparations];
    updated.splice(index, 1);
    setEventForm(prev => ({ ...prev, preparations: updated }));
  };

  const handleSaveEvent = async () => {
    const startTime24 = formatTo24Hour(eventForm.startTime);
    const endTime24 = formatTo24Hour(eventForm.endTime);

    const start_datetime = `${eventForm.startDate}T${startTime24}`;
    const end_datetime = `${eventForm.endDate}T${endTime24}`;
    const start = new Date(start_datetime);
    const end = new Date(end_datetime);

    // Validation
    if (end < start || end === start) {
      alert("End time cannot be earlier than start time.");
      return;
    }

    const payload = {
      user_id: user.id,
      event_name: eventForm.eventName,
      start_datetime,
      end_datetime,
      is_personal: eventForm.isPersonal,
      preparations: eventForm.preparations,
    };

    try {
      await axios.post(`${import.meta.env.VITE_CREATE_EVENT}`, payload);
      setShowCreateModal(false);
      fetchData();
      setEventForm({
        eventName: '',
        startDate: '',
        startTime: { hour: '8', minute: '00', ampm: 'AM' },
        endDate: '',
        endTime: { hour: '9', minute: '00', ampm: 'AM' },
        preparations: [],
        isPersonal: false,
      });
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  const borrowingFrequencyData = borrowings.reduce((acc, b) => {
    const date = new Date(b.borrow_date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const sortedOngoing = ongoingEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const sortedUpcoming = upcomingEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const today = new Date().toDateString();
  const todaysReport = [...ongoingEvents, ...upcomingEvents].filter(event => {
    return new Date(event.startDate).toDateString() === today;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  // Pie chart for most borrowed items
  const itemFrequency = borrowings.reduce((acc, b) => {
    acc[b.item_name] = (acc[b.item_name] || 0) + 1;
    return acc;
  }, {});


  // Pagination for borrowings
  const indexOfLastBorrowing = borrowingsPage * borrowingsPerPage;
  const indexOfFirstBorrowing = indexOfLastBorrowing - borrowingsPerPage;
  const currentBorrowings = borrowings.slice(indexOfFirstBorrowing, indexOfLastBorrowing);

  const totalBorrowingPages = Math.ceil(borrowings.length / borrowingsPerPage);

  const handlePrevBorrowingPage = () => {
    if (borrowingsPage > 1) setBorrowingsPage(prev => prev - 1);
  };

  const handleNextBorrowingPage = () => {
    if (borrowingsPage < totalBorrowingPages) setBorrowingsPage(prev => prev + 1);
  };
  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3">
      </div>

      <Card className="mb-4">
        <Card.Header className="fw-bold text-primary d-flex justify-content-between">
          Quick Stats
          </Card.Header>
        <Card.Body>
          <Row>
            {[
              { label: "Reports Today", value: quickStats.reportsToday, variant: "primary" },
              { label: "Urgent Reports", value: quickStats.urgentReports, variant: "dark" },
              { label: "High Priority Reports", value: quickStats.highPriorityReports, variant: "danger" },
              { label: "Medium Priority Reports", value: quickStats.mediumPriorityReports, variant: "success" },
            ].map(({ label, value, variant }, index) => (
              <Col key={index} sm={6} md={3} className="mb-3">
                <Card bg={variant} text="white" className="h-100 shadow-sm">
                  <Card.Body className="text-center">
                    <Card.Title className="fs-2">{value}</Card.Title>
                    <Card.Text>{label}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      {/* Summary and Reports/Todo */}
      <Row className="mb-4">
        <Col md={6}>
          <Row className="mb-4">
            <Col>
              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">Reports Frequency
                </Card.Header>
                <Card.Body>
                  <Charts type="borrowingFrequency" data={borrowings} />
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
                  Inventory Status
                </Card.Header>
                <Card.Body>
                  <Charts type="inventoryStatus" data={inventoryData} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
                  Borrowers Frequency
                </Card.Header>
                <Card.Body>
                  <Charts type="borrowerRanking" data={borrowersData} />
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
                  Assist Frequencys
                </Card.Header>
                <Card.Body>
                  <Charts type="assistFrequency" data={assistFrequency} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={6}>
          {/* Today's Events */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              Today's Reports
            </Card.Header>
            <Card.Body>
              {todaysReport.length === 0 ? (
                <p>No events scheduled for today</p>
              ) : (
                <Accordion flush>
                  {todaysReport.map((event, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{event.title}</span>
                          <span>{FormatDate(event.startDate, 'short')} | {event.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{event.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
          {/* Ongoing Events */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              Ongoing Maintenance
            </Card.Header>
            <Card.Body>
              {sortedOngoing.length === 0 ? (
                <p>No ongoing maintenance</p>
              ) : (
                <Accordion flush>
                  {sortedOngoing.map((event, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{event.title}</span> 
                          <span>{FormatDate(event.startDate, 'short')} | {event.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                         <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{event.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

          {/* Upcoming Events */}
          <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              Recently Done
            </Card.Header>
            <Card.Body>
              {sortedUpcoming.length === 0 ? (
                <p>No upcoming events</p>
              ) : (
                <Accordion flush>
                  {sortedUpcoming.map((event, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{event.title}</span>
                          <span>{FormatDate(event.startDate, 'short')}-{FormatDate(event.endDate, 'short')} | {event.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Preparations:</strong>
                        <ul className="mb-0">
                          {(event.preparations || []).map((prep, pIdx) => (
                            <li key={pIdx}>{prep.name} (x{prep.quantity})</li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>
          {/* Inventory Table */}
          <DashboardInventoryCard inventoryData={inventoryData}/>
        </Col>
      </Row>
      {/* Borrowing Table with Pagination */}

      <Card className="mb-5">
        <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
          Recent Borrowing Activity
        </Card.Header>
        <Card.Body>
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Borrower</th>
                <th>Date Borrowed</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBorrowings.map((b, idx) => (
                <tr key={idx}>
                  <td><TextTruncate text={b.item_name} maxLength={90} /></td>
                  <td>{b.borrower_name}</td>
                  <td>{new Date(b.borrow_date).toLocaleDateString()}</td>
                  <td>{new Date(b.returned_date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge bg-${b.status === 'Returned' ? 'success'
                          : b.status === 'Approved' ? 'primary'
                            : 'warning'
                        } text-white`}
                    >
                      {b.status}
                    </span>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center mt-3">
          <div>
            Page {borrowingsPage} of {totalBorrowingPages}
          </div>
          <div>
            <Button
              variant="outline-dark"
              size="sm"
              className="me-2"
              disabled={borrowingsPage === 1}
              onClick={handlePrevBorrowingPage}
            >
              Previous
            </Button>
            <Button
              variant="outline-dark"
              size="sm"
              disabled={borrowingsPage === totalBorrowingPages}
              onClick={handleNextBorrowingPage}
            >
              Next
            </Button>
          </div>
        </Card.Footer>
      </Card>
      <CreateEventModal
        show={showCreateModal}
        eventName={eventForm.eventName}
        startDate={eventForm.startDate}
        startTime={eventForm.startTime}
        endDate={eventForm.endDate}
        endTime={eventForm.endTime}
        preparations={eventForm.preparations}
        isPersonal={eventForm.isPersonal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveEvent}
        onInputChange={handleInputChange}
        onAddPreparation={handleAddPreparation}
        onUpdatePreparation={handleUpdatePreparation}
        onRemovePreparation={handleRemovePreparation}
      />

    </div>
  );
};

export default Dashboard;
