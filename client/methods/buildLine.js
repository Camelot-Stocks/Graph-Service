const buildLine = (data, view, svg, line, lineColor) => {
  if (view === '1D') {
    const preMarket = new Date().setHours(9, 30, 0, 0);
    const afterMarket = new Date().setHours(16, 0, 0, 0);
    svg.append('path')
      .attr('d', line(data.filter((d) => d.date <= preMarket)))
      .attr('id', 'pre-market')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-opacity', '1');
    svg.append('path')
      .attr('d', line(data.filter((d) => d.date >= preMarket && d.date <= afterMarket)))
      .attr('id', 'market')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-opacity', '1');
    svg.append('path')
      .attr('d', line(data.filter((d) => d.date >= afterMarket)))
      .attr('id', 'after-market')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('stroke-opacity', '1');
  } else if (view === '1W') {
    const breakPoints = [31, 62, 93, 124];
    svg.append('path')
      .attr('d', line(data.filter((d, i) => i <= breakPoints[0])))
      .attr('id', 'WD1')
      .attr('class', 'weekLine')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    svg.append('path')
      .attr('d', line(data.filter((d, i) => i >= breakPoints[0] && i <= breakPoints[1])))
      .attr('id', 'WD2')
      .attr('class', 'weekLine')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    svg.append('path')
      .attr('d', line(data.filter((d, i) => i >= breakPoints[1] && i <= breakPoints[2])))
      .attr('id', 'WD3')
      .attr('class', 'weekLine')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    svg.append('path')
      .attr('d', line(data.filter((d, i) => i >= breakPoints[2] && i <= breakPoints[3])))
      .attr('id', 'WD4')
      .attr('class', 'weekLine')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    svg.append('path')
      .attr('d', line(data.filter((d, i) => i >= breakPoints[3])))
      .attr('id', 'WD5')
      .attr('class', 'weekLine')
      .attr('stroke', lineColor)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  } else {
    svg
      .append('path')
      .data([data])
      .style('fill', 'none')
      .attr('id', 'priceChart')
      .attr('stroke', lineColor)
      .attr('stroke-width', '1.5')
      .attr('d', line);
  }
};

export default buildLine;
