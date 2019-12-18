const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('db connected'));

const stockSchema = new mongoose.Schema({
  id: Number,
  name: String,
  symbol: String,
  analystHold: Number,
  robinhoodOwners: Number,
  price: Number,
  tags: [{ type: String }],
  historicPrice1D: [{ type: Number }],
  historicPrice1W: [{ type: Number }],
  historicPrice1M: [{ type: Number }],
  historicPrice3M: [{ type: Number }],
  historicPrice1Y: [{ type: Number }],
  historicPrice5Y: [{ type: Number }],
});

const Stock = mongoose.model('Stock', stockSchema);

const save = (stocksArray) => {
  stocksArray.forEach((singleStock) => {
    const newStock = new Stock(singleStock);
    newStock.save((err, stock) => {
      console.log(`Creating Data Entry Company ${stock.id}/100`);

      if (err) throw err;

      if (stock.id === 100) {
        mongoose.disconnect();
      }
    });
  });
};

const find = (id) => Stock.find({ id }).exec();

module.exports = {
  save,
  find,
};
