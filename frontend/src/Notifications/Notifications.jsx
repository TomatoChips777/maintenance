import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Container, Row, Col, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { useAuth } from '../../AuthContext';
import TextTruncate from '../extra/TextTruncate';
import FormatDate from '../extra/DateFormat';
import { io } from 'socket.io-client';
function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    fetchNotifications();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateNotifications', () => {
      fetchNotifications();
    });


    return () => {
      socket.disconnect();
    };
  }, []);



  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_ALL_NOTIFICATIONS}/${user.id}`);
      setNotifications(response.data);
      setFilteredNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = (filterType, search = searchTerm) => {
    let filtered = [...notifications];

    if (filterType === 'read') {
      filtered = filtered.filter(n => n.is_read);
    } else if (filterType === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    }

    if (search.trim()) {
      filtered = filtered.filter(n =>
        n.message.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
    setFilter(filterType);
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    filterNotifications(filter, search);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const handleMarkAsRead = async () => {
    if (selectedNotification && !selectedNotification.is_read) {
      try {
        await axios.put(`${import.meta.env.VITE_GET_NOTIFICATIONS}/${user.id}/notifications/${selectedNotification.id}/read`);
        const updatedNotifications = notifications.map(notification =>
          notification.id === selectedNotification.id ? { ...notification, is_read: true } : notification
        );
        setNotifications(updatedNotifications);
        filterNotifications(filter, searchTerm);
        setShowModal(false);
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col md={8}>
          <h3 className="fw-bold">Notifications</h3>
        </Col>
        <Col md={4}>
          <Form.Select
            value={filter}
            onChange={(e) => filterNotifications(e.target.value)}
            className="shadow-sm"
          >
            <option value="all">All</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="shadow-sm"
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {loading ? (
            <p>Loading notifications...</p>
          ) : filteredNotifications.length === 0 ? (
            <p>No notifications found.</p>
          ) : (
            filteredNotifications.map((notification,index) => (
              <Card
                // key={notification.id}
                key={`${notification.id}-${index}`} 
                className={`mb-3 shadow-sm border-start border-1 ${notification.is_read ? 'border-secondary bg-white' : 'border-primary bg-light'}`}
                style={{ cursor: 'pointer', borderRadius: '10px' }}
                onClick={() => handleNotificationClick(notification)}
              >
                <Card.Body className="position-relative">
                  <Card.Title className="fs-6 fw-semibold">
                    <TextTruncate text={notification.message} maxLength={170} />
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    {FormatDate(notification.created_at)}
                  </Card.Text>
                  {!notification.is_read && (
                    <Badge bg="danger" className="position-absolute top-0 end-0 mt-2 me-2">
                      New
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
      </Row>

      {selectedNotification && (
  <Modal show={showModal} onHide={() => setShowModal(false)} centered size='xl'>
    <Modal.Header closeButton className="bg-light border-0">
      <Modal.Title>Notification Details</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      {selectedNotification.title === 'Events' ? (() => {
        const message = selectedNotification.message;
        const hasOngoing = message.includes('Ongoing Events');
        const hasUpcoming = message.includes('Upcoming Events');

        const ongoingText = hasOngoing
          ? message.split('Upcoming Events')[0].replace('Ongoing Events', '').trim()
          : '';

        const upcomingText = hasUpcoming
          ? message.split('Upcoming Events')[1].trim()
          : '';

        return (
          <Row>
            {hasOngoing && (
              <Col>
                <h6>Ongoing</h6>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{ongoingText}</pre>
              </Col>
            )}
            {hasUpcoming && (
              <Col>
                <h6>Upcoming</h6>
                <pre style={{ whiteSpace: 'pre-wrap' }}>{upcomingText}</pre>
              </Col>
            )}
          </Row>
        );
      })() : (
        <Row>
          <Col>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {selectedNotification.message}
            </pre>
          </Col>
        </Row>
      )}

      <small className='text-muted d-block mt-3'>
        {FormatDate(selectedNotification.created_at)}
      </small>
    </Modal.Body>

    <Modal.Footer className="bg-light border-0">
      {!selectedNotification.is_read && (
        <Button variant="primary rounded-0" size='sm' onClick={handleMarkAsRead}>
          Mark as Read
        </Button>
      )}
      <Button variant="secondary rounded-0" size='sm' onClick={() => setShowModal(false)}>
        Close
      </Button>
    </Modal.Footer>
  </Modal>
)}
    </Container>
  );
}

export default Notifications;
