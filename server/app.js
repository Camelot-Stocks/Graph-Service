const path = require('path');
const express = require('express');
const cors = require('cors');
const fancy = require('fancy-log');
const bodyParser = require('body-parser');
const controller = require('./controller');

const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '../public')));

app.get('/api/graph/stockHistory', async (req, res) => {
  const { id, term } = req.query;
  try {
    const stockHistory = await controller.getStockHistory(id, term);
    res.json(stockHistory);
  } catch (e) {
    fancy(e);
    res.status(500).end('server failed to retrieve stock history');
  }
});

app.use(bodyParser.json({ extended: true }));
app.post('/api/graph/stockHistory', async (req, res) => {
  const { prices } = req.body;
  // TODO - does checking length expose to attack?
  // if (prices.length > 500000) {
  //   res.status(400).end('request rejected, too many records');
  //   return;
  // }

  try {
    const count = await controller.addStockHistory(prices);
    res.json({ count });
  } catch (e) {
    fancy(e);
    res.status(500).end('server failed to add stock history');
  }
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
