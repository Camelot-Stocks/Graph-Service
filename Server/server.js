const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('../Database/database.js');

const port = 3001;
const app = express();

app.use(cors());
app.use('/', express.static(path.resolve(__dirname, '../public')));
app.get('/graph/stocks', (req, res) => {
  const callback = (data) => {
    res.end(JSON.stringify(data));
  };
  // const stockId = req.query.id ? req.query.id : '4';
  const { id } = req.query;
  db.find(id, callback);
});

app.listen(port, () => { console.log(`server now running on ${port}`); });
