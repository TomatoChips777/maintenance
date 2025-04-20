// const express = require('express');
// const router = express.Router();
// const { exec } = require('child_process');

// // Build prompt using current message + in-memory history
// const generatePrompt = (history, userMessage) => {
//     const chatHistory = history
//         .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
//         .join('\n');

//     return `
// You are a helpful assistant. Continue the conversation naturally and informatively.

// Chat History:
// ${chatHistory}

// User: ${userMessage}
// Bot:
// `;
// };

// const userGeneratePrompt = (history, userMessage, context = {}) => {
//     const { formData = {}, selectedItems = [], customItems = [] } = context;
  
//     const greetingMessages = ['hello', 'hi', 'hey'];
  
//     const filteredHistory = Array.isArray(history)
//       ? history.filter((msg, index, arr) => {
//           const isGreeting = greetingMessages.includes(msg.text.trim().toLowerCase());
//           if (!isGreeting) return true;
//           return arr.findIndex(m => m.text.trim().toLowerCase() === msg.text.trim().toLowerCase()) === index;
//         })
//       : [];
  
//     const hasHistory = filteredHistory.length > 0;
  
//     const chatHistory = hasHistory
//       ? `Chat History:\n${filteredHistory
//           .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
//           .join('\n')}\n`
//       : '';
  
//     const formContext = `
//   User Form Data (if any):
//   - Name: ${formData.borrower_name || 'N/A'}
//   - Email: ${formData.email || 'N/A'}
//   - Department: ${formData.department || 'N/A'}
//   - Return Date: ${formData.returned_date || 'N/A'}
//   - Selected Items: ${selectedItems.length ? selectedItems.join(', ') : 'N/A'}
//   - Custom Items: ${customItems.length ? customItems.map(item => `${item.name} (x${item.quantity || 1})`).join(', ') : 'N/A'}
//   - Reason: ${formData.description || 'N/A'}
//     `.trim();
//     return `
//   You are a helpful assistant for the Equipment Borrowing System. Your job is to explain or guide users through the process of borrowing equipment.
  
//   If the user is asking how to borrow, give them a simple, clear explanation of the process. If they are already trying to fill out the form, guide them step-by-step.
  
//   If user asks your name, respond with: "I'm GeloBee 🐝!"
//   If asked who developed you, respond: "I'm a pretrained model that was modified to help with this system."
  
//   If the user wants help rephrasing their reason for borrowing, suggest a clearer, more formal, or more concise version. Ask if they’d like to use it or adjust it further.
  
//   The borrowing process includes:
//   1. Entering full name and email address.
//   2. Selecting their department from a predefined list.
//   3. Choosing a return date.
//   4. Selecting one or more common items OR adding custom items with quantity.
//   5. Explaining the reason for the request.
  
//   Departments available:
//   SDI, MLS, GenEd, Nursing, Rad Teck Pharmacy, Respiratory,
//   Therapy, Physical Therapy, FMO, Library, Guidance Office,
//   Research Office, Registrar's Office, Student Services Office,
//   Pastoral Services, Clinic, Alumni Office
  
//   Commonly borrowed items:
//   EUS Laptop1 w/charger, EUS Laptop2 w/charger, EUS Laptop3 w/charger,
//   EUS Laptop4 w/charger, EUS Laptop5 w/charger, EUS Laptop6 w/charger
  
//   Keep answers friendly, short, and helpful. Use simple language. Ignore unrelated questions.
  
//   Check if there is a values in the form request, and suggest rephrase reason if there is any:
//   ${formContext}
  
//   ${chatHistory}User: ${userMessage}
//   Bot:
//     `;
//   };
  
  
  

// // POST endpoint for simple chat
// router.post('/', async (req, res) => {
//     const { question, history = [] } = req.body;

//     if (!question) {
//         return res.status(400).json({ success: false, message: "Missing question" });
//     }

//     try {
//         const prompt = generatePrompt(history, question);

//         const command = `ollama run llama3.2`;
//         const child = exec(command, (err, stdout, stderr) => {
//             if (err) {
//                 console.error("Ollama error:", err);
//                 return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
//             }

//             const botReply = stdout.trim();
//             res.json({ success: true, answer: botReply });
//         });

//         child.stdin.write(prompt);
//         child.stdin.end();
//     } catch (err) {
//         console.error("Chatbot error:", err);
//         res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//     }
// });



// router.post('/user-assistant', async (req, res) => {
//     const { question, history = [], context={} } = req.body;

//     if (!question) {
//         return res.status(400).json({ success: false, message: "Missing question" });
//     }

//     try {
//         const prompt = userGeneratePrompt(history, question, context);


//         const command = `ollama run llama3.2`;
//         const child = exec(command, (err, stdout, stderr) => {
//             if (err) {
//                 console.error("Ollama error:", err);
//                 return res.status(500).json({ success: false, message: "Ollama error", error: err.message });
//             }

//             const botReply = stdout.trim();
//             res.json({ success: true, answer: botReply });
//         });

//         child.stdin.write(prompt);
//         child.stdin.end();
//     } catch (err) {
//         console.error("Chatbot error:", err);
//         res.status(500).json({ success: false, message: "Internal server error", error: err.message });
//     }
// });
// module.exports = router;


const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const axios = require('axios');
const { getCache, setCache } = require('../utils/cache');

// Fetch dashboard data with caching
const fetchDashboardData = async (user_id) => {
    const cacheKey = 'dashboardData';
    const cachedData = getCache(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await axios.get(`http://localhost:5000/api/dashboard/${user_id}`);
        const dashboardData = response.data;
        setCache(cacheKey, dashboardData, 3600); // cache for 60 seconds
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

  // Construct the assistant prompt with relevant system data and user query
  return `
    You are an advanced assistant with comprehensive knowledge of the IT Support system. You are tasked with assisting the user by providing expert-level guidance 
    and information. Your responses should be direct, based on the provided data and chat history, applying any relevant insights from the system's current state.

    Context: 
    - **Inventory**: ${JSON.stringify(dashboardData.inventory)}
    - **Ongoing Events**: ${JSON.stringify(dashboardData.ongoingEvents)}
    - **Upcoming Events**: ${JSON.stringify(dashboardData.upcomingEvents)}
    - **Today's Events**: ${JSON.stringify(dashboardData.todayEvents)}
    - **Item Borrowing Data**: ${JSON.stringify(dashboardData.borrowings)}
    - **Top Borrowers**: ${JSON.stringify(dashboardData.borrowersRanking)}
    - **Assist Frequency**: ${JSON.stringify(dashboardData.assistFrequency)}
    - **Most Assisted**: ${JSON.stringify(dashboardData.assistFrequency)}
    - **Quick Stats**: ${JSON.stringify(dashboardData.quickStats)}
    

    User: ${userMessage}
    Bot:
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
