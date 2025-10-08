const express = require('express');
const path = require('path');

const app = express();
const PORT = 3500;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname)));

// Route for the game
app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Game server running at http://localhost:${PORT}`);
});