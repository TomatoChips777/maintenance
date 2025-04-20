import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import axios from 'axios';
import CreateEventModal from './components/CreateEventModal';
import ViewEventModal from './components/ViewEventModal';
import EditEventModal from './components/EditEventModal';
import TextTruncate from '../extra/TextTruncate';
import { io } from 'socket.io-client';
import { useAuth } from '../../AuthContext';
function EventManager() {
  const {user} = useAuth();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [eventPlans, setEventPlans] = useState([]);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [preparations, setPreparations] = useState([{ name: '', quantity: 1 }]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isPersonal, setIsPersonal] = useState(false);



  useEffect(() => {

    fetchEvents();

    const socket = io(`${import.meta.env.VITE_API_URL}`);
    socket.on('updateEvents', () => {
        fetchEvents();
    });

    return () => {
        socket.disconnect();
    };

}, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_GET_EVENTS}/${user.id}`);
      const formatted = response.data.flatMap(ev => {
        const eventStartDate = new Date(ev.start_datetime);
        const eventEndDate = new Date(ev.end_datetime);
        const dayOfWeekStart = eventStartDate.getDay();
        const dayOfWeekEnd = eventEndDate.getDay();

        const colorsByDay = {
          0: "#D32F2F",
          1: "#1976D2",
          2: "#388E3C",
          3: "#FBC02D",
          4: "#0288D1",
          5: "#8E24AA",
          6: "#0288D1"
        };
        const isSingleDayEvent = eventStartDate.toDateString() === eventEndDate.toDateString();
        // Generate multiple events if the event spans multiple days
        const eventDates = [];
        let currentDate = new Date(eventStartDate);
        let dayCount = 1;
        while (currentDate <= eventEndDate) {
          const eventTitle = isSingleDayEvent ? ev.event_name : `${ev.event_name} (Day ${dayCount})`;
          eventDates.push({
            ...ev,
            // title: ev.event_name,
            title: eventTitle,
            date: currentDate.toISOString(),
            startTime: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: new Date(eventEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: colorsByDay[currentDate.getDay()],
            equipments: ev.preparations || [],
          });
          currentDate.setDate(currentDate.getDate() + 1);
          dayCount++;
        }

        return eventDates;
      });

      setEventPlans(formatted);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  const handleSaveEvent = async () => {
    const start_datetime = `${startDate}T${startTime}`;
    const end_datetime = `${endDate}T${endTime}`;

    const start = new Date(start_datetime);
    const end = new Date(end_datetime);

    // Validation
    if (end < start || end === start) {
      alert("End time cannot be earlier than start time.");
      return;
    }
    const payload = {
      user_id: user.id,
      event_name: eventName,
      start_datetime,
      end_datetime,
      is_personal: isPersonal ? 1 : 0,
      preparations: preparations.filter(p => p.name.trim() !== '')
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_CREATE_EVENT}`, payload);
      if (response.data.success) {
        fetchEvents(); // refresh list
        setShowCreateModal(false);
        setEventName('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setPreparations([{ name: '', quantity: 1 }]);
      }
    } catch (err) {
      console.error("Error saving event", err);
    }
  };

  const addPreparation = () => {
    setPreparations([...preparations, { name: '', quantity: 1 }]);
  };

  const updatePreparation = (index, field, value) => {
    const updated = [...preparations];
    updated[index][field] = value;
    setPreparations(updated);
  };

  const removePreparation = (index) => {
    const updated = [...preparations];
    updated.splice(index, 1);
    setPreparations(updated);
  };

  const openModal = (event) => {
    console.log(event);
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const closeModal = () => {
    setShowViewModal(false);
  };

  const openEditModal = () => {
    setShowViewModal(false); // Close the view modal
    setShowEditModal(true);  // Open the edit modal
  };

  const closeEditModal = () => {
    setShowEditModal(false); // Close the edit modal
  };
  const handleUpdate = () => {
    fetchEvents(); // Refresh the events after update
    closeEditModal(); // Close the edit modal after update
  };

  const handleMonthChange = (offset) => {
    const newDate = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(new Date(newDate));
  };

  const getDaysInMonth = (month, year) => {
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    return days;
  };

  const currentMonthNumber = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();
  const daysInMonth = getDaysInMonth(currentMonthNumber, currentYear);

  const filteredEvents = eventPlans.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) // Filter by event name
  );

  return (
    <div className="container-fluid p-0 y-0">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Event Preparation's Calendar</h2>
            <Button variant="dark" onClick={() => setShowCreateModal(true)}>
              <i className="bi bi-plus-lg"></i> + Create Event Preparation
            </Button>
          </div>
           {/* Search bar centered and small */}
           <div className="d-flex justify-content-center">
            <Form.Control
              type="text"
              placeholder="Search events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control-sm w-50"
            />
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="dark" onClick={() => handleMonthChange(-1)}>
              <i className="bi bi-arrow-left-circle"></i> Previous
            </Button>
            <h4 className="mb-0">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
            <Button variant="dark" onClick={() => handleMonthChange(1)}>
              Next <i className="bi bi-arrow-right-circle"></i>
            </Button>
          </div>
          <div className="calendar-grid d-flex flex-wrap border">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div key={i} className="text-center py-2 border" style={{ width: '14.2%' }}>
                <strong>{day}</strong>
              </div>
            ))}

            {daysInMonth.map((day, index) => {
              const eventsForDay = filteredEvents.filter(event =>
                new Date(event.date).getDate() === day &&
                new Date(event.date).getMonth() === currentMonthNumber &&
                new Date(event.date).getFullYear() === currentYear
              );

              return (
                <div key={index} className="border p-2" style={{ width: '14.2%', minHeight: '130px' }}>
                  {day ? (
                    <>
                      <div
                        className="fw-bold"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const clickedDate = new Date(currentYear, currentMonthNumber, day);
                          setStartDate(clickedDate.toLocaleDateString('en-CA'));
                          setEndDate(clickedDate.toLocaleDateString('en-CA'));
                          setShowCreateModal(true);
                        }}
                      >
                        {day}
                      </div>
                      <div className='text-white' style={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {eventsForDay
                          .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
                          .map((event, idx) => (
                            <div
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(event);
                              }}
                              style={{
                                backgroundColor: event.color,
                                padding: '5px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                marginBottom: '5px'
                              }}
                            >
                              <TextTruncate text={event.title} maxLength={20} />
                            </div>
                          ))}
                      </div>

                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>

      <ViewEventModal show={showViewModal} event={selectedEvent} onClose={closeModal} onEdit={openEditModal} />
      <CreateEventModal
        show={showCreateModal}
        eventName={eventName}
        startDate={startDate}
        startTime={startTime}
        endDate={endDate}
        endTime={endTime}
        preparations={preparations}
        isPersonal={isPersonal} 
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveEvent}
        onInputChange={(field, value) => {
          switch (field) {
            case 'eventName': setEventName(value); break;
            case 'startDate': setStartDate(value); break;
            case 'startTime': setStartTime(value); break;
            case 'endDate': setEndDate(value); break;
            case 'endTime': setEndTime(value); break;
            case 'isPersonal': setIsPersonal(value); break;
          }
        }}
        onAddPreparation={addPreparation}
        onUpdatePreparation={updatePreparation}
        onRemovePreparation={removePreparation}
      />
      <EditEventModal
        show={showEditModal}
        event={selectedEvent}
        onClose={closeEditModal}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default EventManager;
