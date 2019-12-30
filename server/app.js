const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('../database/index.js');

const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '../public')));

app.get('/api/graph/stockHistory', async (req, res) => {
  const { id } = req.query;

  try {
    const stocks = await db.find(id);
    res.json(stocks);
  } catch (error) {
    res.status(500).end('server cannot retrieve stocks');
  }
});

// eslint-disable-next-line no-unused-vars
app.post('/api/graph/stockHistory', async (req, res) => {
  // TODO
});

// eslint-disable-next-line no-unused-vars
app.put('/api/graph/stockHistory', async (req, res) => {
  // TODO
});

// eslint-disable-next-line no-unused-vars
app.delete('/api/graph/stockHistory', async (req, res) => {
  // TODO
});

module.exports = app;
