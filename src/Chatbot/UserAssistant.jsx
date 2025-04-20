import { useState, useRef, useEffect } from 'react';
import { Button, Offcanvas, Form, CloseButton, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ChatSquareQuoteFill } from 'react-bootstrap-icons';

function UserAssistant({
    title = "Assistant Bot",
    welcomeMessage = "Hello! How can I assist you?",
    formData = {},
    selectedItems = [],
    customItems = []
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'bot', text: welcomeMessage }
  ]);
  const messageEndRef = useRef(null);
  const loadingMsg = { sender: 'bot', text: <Spinner animation="border" size="sm" /> };

  const typeBotReply = (text) => {
    return new Promise((resolve) => {
      let currentText = '';
      let index = 0;

      const interval = setInterval(() => {
        currentText += text[index];
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'bot', text: currentText };
          return updated;
        });

        index++;
        if (index >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 2);
    });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: message }];
    setMessages([...newMessages, loadingMsg]);
    setMessage('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_USER_CHATBOT}`, {
        question: message,
        history: newMessages,
        context: {
            formData,
            selectedItems,
            customItems
          }
      });

      const reply = response.data?.answer || "Sorry, I didn't get that.";

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: '' };
        return updated;
      });

      await typeBotReply(reply);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'bot', text: "Oops, something went wrong!" };
        return updated;
      });
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <>
      {!chatOpen && (
        <Button
          variant="primary"
          style={{
            position: 'fixed',
            bottom: '10px',
            right: '20px',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '24px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            zIndex: 1050,
          }}
          onClick={() => setChatOpen(true)}
        >
          <ChatSquareQuoteFill/>
        </Button>
      )}

      <Offcanvas
        show={chatOpen}
        onHide={() => setChatOpen(false)}
        placement="end"
        backdrop={false}
      >
        <Offcanvas.Header>
          <Offcanvas.Title>{title}</Offcanvas.Title>
          <CloseButton onClick={() => setChatOpen(false)} />
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column chat-canvas-body">
          <div
            className="flex-grow-1 overflow-auto mb-3"
            style={{ maxHeight: '70vh', padding: '10px' }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'} mb-2`}
              >
                <div
                  className={`p-2 messageBubble ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'} small`}
                  style={{
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    padding: '10px 15px',
                    borderRadius: '20px',
                    
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="mb-2"
          />
          <Button variant="primary" onClick={handleSend}>
            Send
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default UserAssistant;
