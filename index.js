
// instantiating server...
const express = require('express');
const app = express();

// initializing process.env...
require('dotenv').config();

// importing json-parsing middleware...
app.use(express.json());

// HOMEWORK :: Cookie-parser !!!!!

// importing router...
const router = require('./routes/authRoutes.js');

// setting middleware for routing...
app.use('/api/v1',router);

// establising database connection...
const dbConnect = require('./config/database.js');
dbConnect();

// exposing server port...
const port = process.env.PORT;
app.listen(port,() => console.log(`Server is listening on port ${port}`));