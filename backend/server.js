const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

const registerRoute = require('./routes/registerRoute');
const loginRoute = require('./routes/loginRoute');
const dashboardRoute = require('./routes/dashboardRoute');
const teammembersRoute = require('./routes/teammembersRoute');
const profileRoute = require('./routes/profileRoute'); // ✅ Add this

dotenv.config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', registerRoute);
app.use('/api', loginRoute);
app.use('/api', dashboardRoute);
app.use('/api', teammembersRoute);
app.use('/api', profileRoute); // ✅ Add this line

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
