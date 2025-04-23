const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const dashboardRoute = require('./routes/dashboardRoute');

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', dashboardRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
