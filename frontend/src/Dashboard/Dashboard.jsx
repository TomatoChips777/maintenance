import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Table, Accordion, Spinner } from 'react-bootstrap';
import axios from 'axios';
import FormatDate from '../extra/DateFormat';
import { io } from 'socket.io-client';
import Charts from './components/Charts';
import { useAuth } from '../../AuthContext';

import DashboardInventoryCard from './components/DashboardInventoryCard';
const Dashboard = () => {
  const { user } = useAuth();
  const [inventoryData, setInventoryData] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);


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

  const sortedOngoing = ongoingEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const sortedUpcoming = upcomingEvents.slice().sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const today = new Date().toDateString();
  const todaysReport = [...ongoingEvents, ...upcomingEvents].filter(event => {
    return new Date(event.startDate).toDateString() === today;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-3">
      </div>
      <Card className="mb-4">
        <Card.Header className="fw-bold text-primary d-flex justify-content-between">
          Quick Stats
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {[
              { label: "Reports Today", value: quickStats.reportsToday, variant: "primary" },
              { label: "Urgent Task", value: quickStats.urgentReports, variant: "dark" },
              { label: "High Priority Task", value: quickStats.highPriorityReports, variant: "danger" },
              { label: "Medium Priority Task", value: quickStats.mediumPriorityReports, variant: "warning" },
              { label: "Low Priority Task", value: quickStats.lowPriorityReports, variant: "success" },
            ].map(({ label, value, variant }, index) => (
              <Col key={index} xs={12} sm={6} md={2} className="flex-grow-1">
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
          <DashboardInventoryCard inventoryData={inventoryData} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
