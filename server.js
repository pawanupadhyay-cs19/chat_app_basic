const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API to save messages
app.post('/send-message', (req, res) => {
    const { username, message } = req.body;
    if (!username || !message) {
        return res.status(400).send('Username and message are required.');
    }

    const filePath = path.join(__dirname, 'messages.json');
    let messages = [];

    // Read existing messages
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        messages = JSON.parse(data);
    }

    // Add the new message
    messages.push({ username, message });

    // Save back to the file
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    res.send({ success: true });
});

// API to get messages
app.get('/messages', (req, res) => {
    const filePath = path.join(__dirname, 'messages.json');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return res.json(JSON.parse(data));
    }
    res.json([]);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
