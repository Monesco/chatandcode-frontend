require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/database'); // Import the database

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(cors());
app.use(bodyParser.json());

//available routes
app.use('/', authRoutes);
app.use('/', chatRoutes);

//starting server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
