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
  const [reports, setReports] = useState([]);
  const [quickStats, setQuickStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reportsToday, setReportsToday] = useState([]);
  const [inProgressReports, setInProgressReports] = useState([]);
  const [recentlyCompletedReports, setRecentlyCompletedReports] = useState([]);

  const fetchData = async () => {
    axios.get(`${import.meta.env.VITE_DASHBOARD_DATA}/${user.id}`)
      .then(res => {
        setInventoryData(res.data.inventory || []);
        setUpcomingEvents(res.data.upcomingEvents || []);
        setOngoingEvents(res.data.ongoingEvents || []);
        setReports(res.data.reportFrequencyResult || []);
        setQuickStats(res.data.quickStats || []);
        setReportsToday(res.data.reportsTodayList)
        setInProgressReports(res.data.inProgressList || []);
        setRecentlyCompletedReports(res.data.recentlyCompletedList || []);
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
                  <Charts type="borrowingFrequency" data={reports} />
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
              {reportsToday.length === 0 ? (
                <p>No task reported for today</p>
              ) : (
                <Accordion flush>
                  {reportsToday.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.created_at, 'short')} | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

          <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              In Progress Reports
            </Card.Header>
            <Card.Body>
              {inProgressReports.length === 0 ? (
                <p>No reports in progress</p>
              ) : (
                <Accordion flush>
                  {inProgressReports.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={report.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.updated_at, 'short')} | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Priority:</strong> {report.priority} <br />
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

          <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              Recently Completed Reports
            </Card.Header>
            <Card.Body>
              {recentlyCompletedReports.length === 0 ? (
                <p>No reports completed recently</p>
              ) : (
                <Accordion flush>
                  {recentlyCompletedReports.map((report, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={report.id}>
                      <Accordion.Header>
                        <div className="w-100 d-flex justify-content-between">
                          <span>{report.location}</span>
                          <span>{FormatDate(report.updated_at, 'short')}  | {report.time}</span>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <strong>Priority:</strong> {report.priority} <br />
                        <strong>Description:</strong>
                        <ul className="mb-0">
                          <li>{report.description}</li>
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              )}
            </Card.Body>
          </Card>

          {/* Ongoing task */}
          {/* <Card className='mb-4'>
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
          </Card> */}

          {/* Recent Completed Task */}
          {/* <Card className='mb-4'>
            <Card.Header className="fw-semibold text-primary d-flex justify-content-between">
              Recently Completed Task
            </Card.Header>
            <Card.Body>
              {sortedUpcoming.length === 0 ? (
                <p>No recent completed task</p>
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
          </Card> */}
          {/* Inventory Table */}
          <DashboardInventoryCard inventoryData={inventoryData} />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
