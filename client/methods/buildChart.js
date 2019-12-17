import * as d3 from 'd3';
import moment from 'moment';
import buildLine from './buildLine';
import setTimeIntervals from './setTimeIntervals';
import updateHover from './updateHover';

const bisectDate = (data, matcher) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].date > matcher) {
      return i;
    }
  }
  return 1;
};

const updateLegend = (currentData, prices, svg, view) => {
  d3.selectAll('.lineLegend').remove();
  let offset; let
    xRate;
  const formatDate = (date) => {
    switch (view) {
      case '1D': offset = 33; xRate = 6.315; return (`${moment(date).format('h:mm a')} ET`);
      case '1W': offset = 56; xRate = 4.38; return (`${moment(date).format('h:mm a, MMM D')} ET`);
      case '1M': offset = 56; xRate = 5.68; return (`${moment(date).format('h:mm a, MMM D')} ET`);
      case '3M': offset = 56; xRate = 1.88; return (`${moment(date).format('h:mm a, MMM D')} ET`);
      case '1Y': offset = 47; xRate = 2.71; return (`${moment(date).format('MMM D, YYYY')} ET`);
      case '5Y': offset = 47; xRate = 2.605; return (`${moment(date).format('MMM D, YYYY')} ET`);
    }
  };

  const lineLegend = svg
    .selectAll('.lineLegend')
    .data(['date'])
    .enter()
    .append('g')
    .attr('class', 'lineLegend')
    .attr('transform', (d, i) => `translate(0, ${i * 20})`);
  lineLegend
    .append('text')
    .text((d) => {
      if (d === 'date') {
        return formatDate(currentData[d]);
      }
    })
    .style('fill', '#cbcbcd')
    .attr('transform', `translate(${prices.indexOf(currentData.price) * xRate - offset},-5)`);
};

const buildGreyLine = (data, view, svg, xScale, yScale) => {
  if (view === '1D') {
    const ticks = [];
    for (let i = 0; i < data.length; i++) { ticks.push({ date: data[i].date, price: data[0].price }); }
    svg.selectAll('circle')
      .data(ticks)
      .enter()
      .append('circle')
      // .attr('color', ()=> {debugger})
      .attr('cx', (d) => xScale(d.date))
      .attr('cy', (d) => yScale(d.price))
      .attr('r', '0.7')
      .attr('fill', 'grey')
      .attr('z-index', '10');
  } else {
    d3.selectAll('circle').remove();
  }
};

const hoverOutShade = (view) => {
  if (view === '1D') {
    const afterHours = new Date();
    afterHours.setHours(16);
    d3.select('#pre-market')
      .attr('stroke-opacity', '1');
    d3.select('#market')
      .attr('stroke-opacity', '1');
    d3.select('#after-market')
      .attr('stroke-opacity', '1');
  } else if (view === '1W') {
    d3.selectAll('.weekLine')
      .attr('stroke-opacity', '1');
  }
};

const buildChart = (prices, view, updateTicker, lineColor, backgroundColor) => {
  // do setup
  d3.selectAll('svg').remove();
  const data = [];
  const [mostRecentDate, mostRecentPrice] = setTimeIntervals(data, view, prices);
  const margin = {
    top: 50, right: 0, bottom: 20, left: 0,
  };
  const width = 676;
  const height = 196;
  const xMin = d3.min(data, (d) => d.date);
  const xMax = d3.max(data, (d) => d.date);
  const yMin = d3.min(data, (d) => d.price);
  const yMax = d3.max(data, (d) => d.price);
  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height, 0]);
  // append svg to page and set attributes
  const svg = d3
    .select('#stockPriceHistoryChart')
    .append('svg')
    .attr('overflow', 'visible')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},  ${margin.top})`);
  const line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.price));

  // Divide into sections and build line
  buildLine(data, view, svg, line, lineColor);

  // Append grey axis overlay
  buildGreyLine(data, view, svg, xScale, yScale);

  function generateCrosshair() {
    const correspondingDate = xScale.invert(d3.mouse(this)[0]);
    const i = bisectDate(data, correspondingDate.getTime());
    let currentPoint;
    if (data[i].price) {
      currentPoint = data[i];
      updateHover(currentPoint, view, updateTicker, mostRecentPrice);
    } else {
      currentPoint = { date: mostRecentDate, price: mostRecentPrice };
    }
    focus.attr('transform', `translate(${xScale(currentPoint.date)},${yScale(currentPoint.price)})`);

    focus
      .select('line.y')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', height - height - yScale(currentPoint.price))
      .attr('y2', height - yScale(currentPoint.price));
    updateLegend(currentPoint, prices, svg, view);
  }
  console.log('here', backgroundColor);
  const focus = svg
    .append('g')
    .attr('class', 'focus')
    .attr('fill', lineColor)
    .attr('stroke', backgroundColor)
    .attr('stroke-width', '2')
    .style('display', 'none');
  focus.append('line').classed('y', true);
  focus.append('circle').attr('r', 4.5);
  // legend of date
  svg
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', () => (focus.style('display', null)))
    .on('mouseout', () => {
      updateTicker(mostRecentPrice);
      hoverOutShade(view);
      d3.selectAll('.lineLegend').remove();
      focus.style('display', 'none');
    })
    .on('mousemove', generateCrosshair);
  d3.select('.overlay')
    .style('fill', 'none')
    .style('pointer-events', 'all');
  d3.selectAll('.focus line')
    .style('z-index', '-1')
    .style('fill', 'none')
    .style('stroke', '#ababab')
    .style('stroke-width', '1.5px');
  return { mostRecentDate, mostRecentPrice };
};

export default buildChart;
