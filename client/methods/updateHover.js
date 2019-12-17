import * as d3 from 'd3';
import moment from 'moment';

const updateHover = ({ date, price }, view, updateTicker, mostRecentPrice) => {
  if (view === '1D') {
    const preMarket = new Date().setHours(9, 30, 0, 0);
    const afterMarket = new Date().setHours(16, 0, 0, 0);
    d3.select('#pre-market')
      .attr('stroke-opacity', '.5');
    d3.select('#market')
      .attr('stroke-opacity', '.5');
    d3.select('#after-market')
      .attr('stroke-opacity', '.5');
    if (date <= preMarket) {
      d3.select('#pre-market')
        .attr('stroke-opacity', '1');
      updateTicker(price, 'Pre-Market');
    }
    if (date >= preMarket && date <= afterMarket) {
      d3.select('#market')
        .attr('stroke-opacity', '1');
      updateTicker(price, '');
    }
    if (date >= afterMarket) {
      d3.select('#after-market')
        .attr('stroke-opacity', '1');
      updateTicker(price, 'After Hours');
    }
  } else if (view === '1W') {
    let D2 = new Date();
    let D3 = new Date();
    let D4 = new Date();
    let D5 = new Date();
    D2 = moment(D2).subtract(5, 'd').toDate().setHours(14, 30, 0, 0);
    D3 = moment(D3).subtract(5, 'd').toDate().setHours(19, 50, 0, 0);
    D4 = moment(D4).subtract(4, 'd').toDate().setHours(1, 0, 0, 0);
    D5 = moment(D5).subtract(4, 'd').toDate().setHours(6, 10, 0, 0);
    // D2 = moment(D2).subtract(4, 'd').toDate().setHours(9, 30, 0, 0);
    // D3 = moment(D3).subtract(3, 'd').toDate().setHours(9, 30, 0, 0);
    // D4 = moment(D4).subtract(2, 'd').toDate().setHours(9, 30, 0, 0);
    // D5 = moment(D5).subtract(1, 'd').toDate().setHours(9, 30, 0, 0);
    d3.selectAll('.weekLine')
      .attr('stroke-opacity', '.5');
    if (date <= D2) {
      d3.select('#WD1')
        .attr('stroke-opacity', '1');
    }
    if (date >= D2 && date <= D3) {
      d3.select('#WD2')
        .attr('stroke-opacity', '1');
    }
    if (date >= D3 && date <= D4) {
      d3.select('#WD3')
        .attr('stroke-opacity', '1');
    }
    if (date >= D4 && date <= D5) {
      d3.select('#WD4')
        .attr('stroke-opacity', '1');
    }
    if (date >= D5) {
      d3.select('#WD5')
        .attr('stroke-opacity', '1');
    }
    updateTicker(price, '');
  } else {
    updateTicker(price, '');
  }
};

export default updateHover;
