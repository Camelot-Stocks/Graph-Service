import moment from 'moment';

const setTimeIntervals = (data, view, prices) => {
  let start = new Date();
  const now = moment(start).add(3, 'h').toDate();
  let mostRecentPrice = prices[prices.length - 1];
  let mostRecentDate;
  switch (view) {
    case '1D':
      start.setHours(9, 0, 0, 0);
      let once = false;
      for (let i = 0; i < prices.length; i++) {
        if (start > now && Date.now < start) {
          data[i] = { date: start, price: undefined };
          if (!once) {
            mostRecentPrice = prices[i - 1];
            mostRecentDate = new Date(moment(start).subtract(5, 'm'));
            once = true;
          }
        } else {
          data[i] = { date: start, price: prices[i] };
        }
        start = moment(start).add(5, 'm').toDate();
      }
      break;
    case '1W':
      start = moment(start).subtract(5, 'd').toDate();
      start.setHours(9, 30, 0, 0);
      for (let i = 0; i < prices.length; i++) {
        data[i] = { date: start, price: prices[i] };
        start = moment(start).add(10, 'm').toDate();
      }
      // pastTime = 16;
      // for (let i = 0; i < prices.length; i++) {
      //   data[i] = {date: start, price: prices[i]}
      //   start = moment(start).add(5, 'm').toDate();
      //   if(pastTime <= start.getHours()) {
      //     console.log(start.getHours());
      //     start = moment(start).add(1, 'd').toDate();
      //     start.setHours(9, 0, 0, 0);
      //   }
      // }
      break;
    case '1M':
      start = moment(start).subtract(1, 'm').toDate();
      start.setHours(10, 0, 0, 0);
      for (let i = 0; i < prices.length; i++) {
        data[i] = { date: start, price: prices[i] };
        start = moment(start).add(1, 'h').toDate();
      }
      break;
    case '3M':
      start = moment(start).subtract(3, 'm').toDate();
      start.setHours(10, 0, 0, 0);
      for (let i = 0; i < prices.length; i++) {
        data[i] = { date: start, price: prices[i] };
        start = moment(start).add(1, 'h').toDate();
      }
      break;
    case '1Y':
      start = moment(start).subtract(1, 'y').toDate();
      start.setHours(10, 0, 0, 0);
      for (let i = 0; i < prices.length; i++) {
        data[i] = { date: start, price: prices[i] };
        start = moment(start).add(1, 'd').toDate();
      }
      break;
    case '5Y':
      start = moment(start).subtract(5, 'Y').toDate();
      start.setHours(10, 0, 0, 0);
      for (let i = 0; i < prices.length; i++) {
        data[i] = { date: start, price: prices[i] };
        start = moment(start).add(7, 'd').toDate();
      }
      break;
  }
  return [mostRecentDate, mostRecentPrice];
};

export default setTimeIntervals;
