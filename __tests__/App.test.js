import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
// import App from '../Client/App';
// import Graph from '../Client/Graph';
// import Header from '../Client/Header';
import {App, Graph, Header} from '../Public/main.js'

let wrapper = shallow(<App />);
describe('<App /> Component', () => {
	test('App Should exist', () => {
		expect(wrapper.exists()).to.be.true;
	});
	test('Should have sub-component graph', () => {
		expect(wrapper.find(Graph).length).toEqual(1);
	});
	test('Should have sub-component header', () => {
		expect(wrapper.find(Header).length).toEqual(1);
	});
})


wrapper = shallow(<Graph />);
test('Graph Should Exist', () => {
	expect(wrapper.exists()).to.be.true;
});
test('Default view should be 1D', () => {
	expect(wrapper.find(Header).length).toEqual(1);
});
test('Default view should be 1D', () => {
	expect(wrapper.find(Header).length).toEqual(1);
});

test('two plus two is four', () => {
	expect(2 + 2).toBe(4);
});