const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');


const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
const today = new Date().toLocaleDateString(undefined, dateOptions);

const formatBorrowings = (borrowings) => {
  return borrowings.map((b, index) => `Borrowing ${index + 1}:
  - Borrowers Names: ${b.borrower_name}
  - Item(s): ${b.item_name}
  - Borrow Date: ${new Date(b.borrow_date).toLocaleDateString(undefined, dateOptions)}
  - Status: ${b.status}`).join('\n\n');
};
const formatInventory= (inventory) => {
  return inventory.map((item, index) => `Inventory Item ${index + 1}:
  - Name: ${item.item}
  - Available: ${item.available}
  - Status: ${item.status}`).join('\n\n');
};
const formatOngoingEvents = (events) => {
  return events.map((event, index) => {
    const prepItems = event.preparations.map(p => `    - ${p.name} (x${p.quantity})`).join('\n');
    return `Ongoing Event ${index + 1}:
  - Title: ${event.title}
  - Date: ${new Date(event.startDate).toLocaleDateString(undefined, dateOptions)} - ${new Date(event.endDate).toLocaleDateString(undefined, dateOptions)}
  - Time: ${event.time}
  - Preparations:\n${prepItems}`;
  }).join('\n\n');
};
const formatTodayEvents = (events) => {
    return events.map((event, index) => {
      const prepItems = event.preparations.map(p => `    - ${p.name} (x${p.quantity})`).join('\n');
      return `Today's Event ${index + 1}:
    - Title: ${event.title}
    - Date: ${new Date(event.startDate).toLocaleDateString(undefined, dateOptions)} - ${new Date(event.endDate).toLocaleDateString(undefined, dateOptions)}
    - Time: ${event.time}
    - Preparations:\n${prepItems}`;
    }).join('\n\n');
  };
  const formatUpcomingEvents= (events) => {
    return events.map((event, index) => {
      const prepItems = event.preparations.map(p => `    - ${p.name} (x${p.quantity})`).join('\n');
      return `Upcoming Event ${index + 1}:
    - Title: ${event.title}
    - Date: ${new Date(event.startDate).toLocaleDateString(undefined, dateOptions)} - ${new Date(event.endDate).toLocaleDateString(undefined, dateOptions)}
    - Time: ${event.time}
    - Preparations:\n${prepItems}`;
    }).join('\n\n');
  };
// Fetch dashboard data with caching
const fetchDashboardData = async (user_id) => {
    const cacheKey = 'dashboardData';
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(`http://localhost:3000/api/dashboard/${user_id}`);
        const dashboardData = response.data;
        setCache(cacheKey, dashboardData, 3600);
        return dashboardData;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return null;
    }
};
// Safely stringify objects for logging
const safeStringify = (obj) => {
    const seen = new Set();
    return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    });
};
// Build the prompt
const generatePrompt = (history, userMessage, dashboardData) => {
  // List of greetings to handle redundant greeting messages in the history
  const greetingMessages = ['hello', 'hi', 'hey'];

  // Filter chat history to remove repeated greetings from the same user
  const filteredHistory = Array.isArray(history)
    ? history.filter((msg, index, arr) => {
        const isGreeting = greetingMessages.includes(msg.text.trim().toLowerCase());
        if (!isGreeting) return true;
        return arr.findIndex(m => m.text.trim().toLowerCase() === msg.text.trim().toLowerCase()) === index;
      })
    : [];

  const hasHistory = filteredHistory.length > 0;

  // Build chat history string, showing messages from both user and bot
  const chatHistory = hasHistory
    ? `Chat History:\n${filteredHistory
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
        .join('\n')}\n`
    : '';
  return `
  You are a skilled and efficient data analyst assistant bot. Your role is to analyze the provided questions and deliver clear, concise, and informative responses based on the user's inquiry.
   This system manages inventory, events (including preparations), and item borrowing for an IT support and operations environment — not a library.
   **User's Question:**  
   ${userMessage}
   `;
};


// Handle incoming chat requests
router.post('/', async (req, res) => {
    const { question, history = [], user_id } = req.body;

    if (!question) {
        return res.status(400).json({ success: false, message: "Missing question" });
    }

    try {
        const dashboardData = await fetchDashboardData(user_id);
        
        if (!dashboardData) {
            return res.status(500).json({ success: false, message: "Error fetching dashboard data" });
        }

        const prompt = generatePrompt(history, question, dashboardData);

        const command = `ollama run llama3.2`;
        const child = exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error("Ollama error:", err);
                return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
            }

            const botReply = stdout.trim();
            res.json({ success: true, answer: botReply });
        });

        child.stdin.write(prompt);
        child.stdin.end();
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

const userGeneratePrompt = (history, userMessage, context = {}) => {
    const { formData = {}, selectedItems = [], customItems = [] } = context;
  
    const greetingMessages = ['hello', 'hi', 'hey'];
  
    const filteredHistory = Array.isArray(history)
      ? history.filter((msg, index, arr) => {
          const isGreeting = greetingMessages.includes(msg.text.trim().toLowerCase());
          if (!isGreeting) return true;
          return arr.findIndex(m => m.text.trim().toLowerCase() === msg.text.trim().toLowerCase()) === index;
        })
      : [];
  
    const hasHistory = filteredHistory.length > 0;
  
    const chatHistory = hasHistory
      ? `Chat History:\n${filteredHistory
          .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
          .join('\n')}\n`
      : '';
  
    const formContext = `
  User Form Data (if any):
  - Name: ${formData.borrower_name || 'N/A'}
  - Email: ${formData.email || 'N/A'}
  - Department: ${formData.department || 'N/A'}
  - Return Date: ${formData.returned_date || 'N/A'}
  - Selected Items: ${selectedItems.length ? selectedItems.join(', ') : 'N/A'}
  - Custom Items: ${customItems.length ? customItems.map(item => `${item.name} (x${item.quantity || 1})`).join(', ') : 'N/A'}
  - Reason: ${formData.description || 'N/A'}
    `.trim();
    return `
  You are a helpful assistant for the Equipment Borrowing System. Your job is to explain or guide users through the process of borrowing equipment.
  
  If the user is asking how to borrow, give them a simple, clear explanation of the process. If they are already trying to fill out the form, guide them step-by-step.
  
  If user asks your name, respond with: "I'm GeloBee 🐝!"
  If asked who developed you, respond: "I'm a pretrained model that was modified to help with this system."
  
  If the user wants help rephrasing their reason for borrowing, suggest a clearer, more formal, or more concise version. Ask if they’d like to use it or adjust it further.
  
  The borrowing process includes:
  1. Entering full name and email address.
  2. Selecting their department from a predefined list.
  3. Choosing a return date.
  4. Selecting one or more common items OR adding custom items with quantity.
  5. Explaining the reason for the request.
  
  Departments available:
  SDI, MLS, GenEd, Nursing, Rad Teck Pharmacy, Respiratory,
  Therapy, Physical Therapy, FMO, Library, Guidance Office,
  Research Office, Registrar's Office, Student Services Office,
  Pastoral Services, Clinic, Alumni Office
  
  Commonly borrowed items:
  EUS Laptop1 w/charger, EUS Laptop2 w/charger, EUS Laptop3 w/charger,
  EUS Laptop4 w/charger, EUS Laptop5 w/charger, EUS Laptop6 w/charger
  
  Keep answers friendly, short, and helpful. Use simple language. Ignore unrelated questions.
  
  Check if there is a values in the form request, and suggest rephrase reason if there is any:
  ${formContext}
  
  ${chatHistory}User: ${userMessage}
  Bot:
    `;
  };
// Handle user-assistant requests
router.post('/user-assistant', async (req, res) => {
    const { question, history = [], context = {} } = req.body;

    if (!question) {
        return res.status(400).json({ success: false, message: "Missing question" });
    }
    try {
        const prompt = userGeneratePrompt(history, question, context);

        const command = `ollama run llama3.2`;
        const child = exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error("Ollama error:", err);
                return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
            }

            const botReply = stdout.trim();
            res.json({ success: true, answer: botReply });
        });

        child.stdin.write(prompt);
        child.stdin.end();
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
});

module.exports = router;
