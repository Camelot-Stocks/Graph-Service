const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('../Database/database.js');

const port = 3001;
const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '../public')));

app.get('/graph/stocks', async (req, res) => {
  const { id } = req.query;

  try {
    const stocks = await db.find(id);
    res.end(JSON.stringify(stocks));
  } catch (error) {
    res.status(500).end('server cannot retrieve stocks');
  }
});

app.listen(port, () => { console.log(`server now running on ${port}`); });
