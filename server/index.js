require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./routes.js');
const pool = require('../database/postgreSQL/index.js');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/reviews', router);

app.get('/', (req, res) => {
  res.send('API server is running');
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))