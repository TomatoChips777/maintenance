import { useState, useRef, useEffect } from 'react';
import { Button, Offcanvas, Form, CloseButton, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { ChatSquareQuoteFill } from 'react-bootstrap-icons';
import { useAuth } from '../../AuthContext';

function ChatWidget({
  title = "Assistant Bot",
  welcomeMessage = "Hello! How can I assist you?",
  askMessage = "",
}) {
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);  // Chat visibility state
  const [message, setMessage] = useState('');
  const [isBotResponding, setIsBotResponding] = useState(false);
  const [shouldAutoSend, setShouldAutoSend] = useState(false);
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);
  const loadingMsg = { sender: 'bot', text: <Spinner animation="border" size="sm" /> };

  // Simulate typing effect for bot replies
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

  // Function to handle sending a message to the bot
  // const handleSend = async () => {
  //   if (!message.trim() || isBotResponding) return;

  //   setIsBotResponding(true);
  //   const newMessages = [...messages, { sender: 'user', text: message }];
  //   setMessages([...newMessages, loadingMsg]);
  //   setMessage('');

  //   try {
  //     const response = await axios.post(`${import.meta.env.VITE_CHATBOT}`, {
  //       question: message,
  //       history: newMessages,
  //       user_id: user.id,
  //     });

  //     const reply = response.data?.answer || "Sorry, I didn't get that.";
  //     // Replace spinner with empty string before typing
  //     setMessages(prev => {
  //       const updated = [...prev];
  //       updated[updated.length - 1] = { sender: 'bot', text: '' };
  //       return updated;
  //     });

  //     await typeBotReply(reply);
  //   } catch (error) {
  //     console.error("Chat error:", error);
  //     setMessages(prev => {
  //       const updated = [...prev];
  //       updated[updated.length - 1] = { sender: 'bot', text: "Oops, something went wrong!" };
  //       return updated;
  //     });
  //   } finally {
  //     setIsBotResponding(false);
  //   }
  // };

  const handleSend = async (customMessage = null) => {
    const msgToSend = customMessage ?? message;
    if (!msgToSend.trim() || isBotResponding) return;
  
    setIsBotResponding(true);
  
    // Only add user message to the messages list if it's not from askMessage
    const shouldSkipAppend = askMessage && msgToSend === askMessage;
  
    const userMsg = { sender: 'user', text: msgToSend };
    const updatedMessages = shouldSkipAppend ? [...messages] : [...messages, userMsg];
  
    // Add loading placeholder
    setMessages([...updatedMessages, loadingMsg]);
  
    if (!customMessage) setMessage(''); // clear input box only if it was a typed message
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_CHATBOT}`, {
        question: msgToSend,
        history: updatedMessages,
        user_id: user.id,
      });
  
      const reply = response.data?.answer || "Sorry, I didn't get that.";
  
      // Replace loading spinner with empty string to simulate typing
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
    } finally {
      setIsBotResponding(false);
    }
  };
  
  // Scroll to the latest message after update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (askMessage) {
      setMessage(askMessage);
      setShouldAutoSend(true);   // Mark that this should trigger an auto-send
      setChatOpen(true);         // Open the chat
    }
  }, [askMessage]);

  // Only auto-send once, when shouldAutoSend is true
  useEffect(() => {
    if (shouldAutoSend && message && !isBotResponding) {
      handleSend();
      setShouldAutoSend(false)
    }
  }, [shouldAutoSend, message, isBotResponding]);

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isBotResponding) handleSend();
    }
  };

  return (
    <>
      {/* Button to open the chat if it's not open */}
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
          onClick={() => {
            setChatOpen(true);
            setTimeout(() => {
              messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);            
    }}
        >
          <ChatSquareQuoteFill />
        </Button>
      )}

      {/* Chat Window */}
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
            {messages.map((msg, idx) => {
              // Skip showing user message if it was auto-sent from askMessage
              const isAutoAskUserMessage = askMessage && msg.sender === 'user' && msg.text === askMessage;
              if (isAutoAskUserMessage) return null;

              return (
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
              );
            })}

            {/* {messages.map((msg, idx) => (
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
            ))} */}
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
            disabled={isBotResponding}
          />

          <Button variant="primary" onClick={handleSend} disabled={isBotResponding}>
            {isBotResponding ? <Spinner animation="border" size="sm" /> : 'Send'}
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default ChatWidget;
