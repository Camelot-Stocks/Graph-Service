/* eslint-disable no-undef */
import React from 'react';
import path from 'path';
import Header from './Header.jsx';
import Graph from './Graph.jsx';
import buildChart from '../methods/buildChart.js';
import buildViewText from '../methods/buildViewText.js';
import Odometer from 'odometer';
import 'odometer/themes/odometer-theme-minimal.css';
import Wrapper from '../styled-components/Wrapper';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			view: '1D',
			viewText: 'Last Day',
			timeOfDay: 'Pre-Market',
			lineColor: '#21ce99',
			backgroundColor: 'white',
			id: null,
			name: null,
			symbol: null,
			analystHold: 0,
			robinhoodOwners: 0,
			price: 0,
			tags: [],
			historicPrice1D: [],
			historicPrice1W: [],
			historicPrice1M: [],
			historicPrice3M: [],
			historicPrice1Y: [],
			historicPrice5Y: [],
			gainLoss: 0,
			gainLossPercent: 0,
			gainlossSymbol: '',
		};
		this.updateTicker = this.updateTicker.bind(this);
		this.changeView = this.changeView.bind(this);
		this.ticker = null;
	}

	componentDidMount() {
		this.populateStocks(() => {
			this.initializeTicker();
			this.updateBackgroundColor();
			let { mostRecentDate, mostRecentPrice } = buildChart(this.state[`historicPrice${this.state.view}`], this.state.view, this.updateTicker, this.state.lineColor, this.state.backgroundColor);
			this.updateTicker(mostRecentPrice);
			this.updateGlobalColor();
		});
	}

	changeView(option) {
		this.setState({
			view: option,
			viewText: buildViewText(option),
			price: this.state[`historicPrice${option}`][this.state[`historicPrice${option}`].length - 1]
		}, () => {
			buildChart(this.state[`historicPrice${this.state.view}`], this.state.view, this.updateTicker, this.state.lineColor, this.state.backgroundColor)
			this.updateTicker(this.state.price);
		}
		);
	}

	populateStocks(callback) {
		fetch(`/api/graph/stockHistory${window.location.search || '?id=4'}`, { method: 'GET' })
			.then((response) => response.json())
			.then((data) => { 
				// debugger;
				this.setState(data[0], callback); 
			});
	}

	initializeTicker() {
		const tickerEl = document.getElementById('odometer');
		this.ticker = new Odometer({
			el: tickerEl,
			value: 12.34,
			duration: 400,
			theme: 'minimal',
			format: '(,ddd).dd',
		});
	}

	updateBackgroundColor() {
		const d = new Date();
		const totalMinutes = (d.getHours() * 60) + d.getMinutes();
		let background = '';
		if (totalMinutes < 360 || totalMinutes >= 900) {
			background = '#1B1B1D';
		} else {
			background = 'white';
		}
		this.setState({
			backgroundColor: background,
		})
	}

	updateGlobalColor() {
		fetch(`/updateLineColors`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ color: this.state.lineColor })
		})
	}

	updateTicker(price, text = buildViewText(this.state.view)) {
		if (price !== undefined) this.ticker.update(price.toFixed(2));
		let currentPriceArray = this.state[`historicPrice${this.state.view}`];
		let gainLoss = price - currentPriceArray[0];
		let gainlossSymbol = gainLoss >= 0 ? '+' : '-';
		let gainLossPercent = gainLoss / currentPriceArray[currentPriceArray.length - 1];
		this.setState({
			viewText: text,
			gainLoss: gainLoss,
			gainLossPercent: gainLossPercent,
			gainlossSymbol: gainlossSymbol,
			// lineColor: currentPriceArray[0]-currentPriceArray[currentPriceArray.length-1] > 0 ? '#f45531' : '#21ce99',
		})
	}

	render() {
		return (
			<Wrapper.App backgroundColor={this.state.backgroundColor}>
				<Header state={this.state} />
				<Graph changeView={this.changeView} view={this.state.view} state={this.state}/>
			</Wrapper.App>
		);
	}
}

export default App;
