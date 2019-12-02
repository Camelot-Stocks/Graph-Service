/* eslint-disable no-undef */
import React from 'react';
import path from 'path';
import { CountUp } from 'countup.js';
import Header from './Header.jsx';
import Graph from './Graph.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: '1D',
			id: null,
			name: null,
			symbol: null,
			analystHold: 0,
			robinhoodOwners: 0,
			price: 0,
			historicPrice1D: [],
			historicPrice1W: [],
			historicPrice1M: [],
			historicPrice3M: [],
			historicPrice1Y: [],
			historicPrice5Y: [],
		};
		this.updateTicker = this.updateTicker.bind(this);
		this.changeView = this.changeView.bind(this);
		this.ticker = null;
	}

	componentDidMount() {
		this.populateStocks(() => {
			this.initializeTicker();
		});
	}

	changeView(option) {
		this.setState({
			view: option,
		});
	}
	
	populateStocks(callback) {
		fetch(`/stocks${window.location.search}`, { method: 'GET' })
		.then((response) => response.json() )
		.then((data) => { this.setState(data[0], callback); });
	}

	initializeTicker() {
		const options = {
			decimalPlaces: 2,
		};
		this.ticker = new CountUp('ticker', this.state.price, options);
		this.ticker.start();
	}

	updateTicker(price) {
		this.ticker.update(price);
	}
	
	render() {
		return (
			<div>
				<Header state={this.state} />
				<Graph state={this.state} updateTicker={this.updateTicker} changeView={this.changeView} />
			</div>
		);
	}
}

export default App;
