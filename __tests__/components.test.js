import React from 'react';
import { shallow, mount } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
// import fetch from 'isomorphic-fetch';
// import Odometer from 'odometer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { tsExpressionWithTypeArguments } from '@babel/types';
import App from '../client/components/App';
import Graph from '../client/components/Graph';
import Header from '../client/components/Header';
import ChartTab from '../client/components/ChartTab';
import Expand from '../client/components/Expand';
import Wrapper from '../client/styled-components/Wrapper';

describe('Components', () => {
  describe('<App /> Component', () => {
    let component;
    beforeEach(() => component = shallow(<App />));

    const mockSuccessResponse = {};
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchPromise);

    it('should create App', () => {
      expect(component).toHaveLength(1);
    });
    it('Should have sub-component graph', () => {
      expect(component.find(Graph).length).toEqual(1);
    });
    it('Should have sub-component header', () => {
      expect(component.find(Header).length).toEqual(1);
    });
    it('should hold state and have default values', () => {
      expect(component.state('view')).toBe('1D');
      expect(component.state('price')).toBe(0);
    });

    it('should have a function to change view', () => {
      const changeViewSpy = jest.fn();
      const component = shallow(<App changeView={changeViewSpy} />);
      const instance = component.instance();
      instance.changeView('1W');
      expect(instance.state.view).toBe('1W');
    });

    // it('should have Ticker', () => {
    // 	const updateTickerSpy = jest.fn();
    // 	const component = mount(<App ticker={new Odometer()} updateTicker={updateTickerSpy}/>)
    // 	const instance = component.instance();
    // 	instance.updateTicker(55);
    // 	expect(instance.updateTicker).toHaveBeenCalled();
    // })

    // it('should have Ticker and a function to update Ticker', () => {
    // 	const updateTickerSpy = jest.fn();
    // 	let odometer = new Odometer({el: window, value: 50});
    // 	const component = shallow(<App ticker={odometer} updateTicker={updateTickerSpy}/>)
    // 	const instance = component.instance();
    // 	instance.updateTicker(55);
    // 	expect(instance.props.ticker.value).toBe(55);
    // })
  });

  describe('<Graph /> Component', () => {
    let component;
    beforeEach(() => component = shallow(<Graph />));

    test('Graph Should Exist', () => {
      expect(component).toHaveLength(1);
    });
    test('Should have sub-component charttab', () => {
      expect(component.find(ChartTab).length).toEqual(1);
    });
    test('Should have sub-component expand', () => {
      expect(component.find(Expand).length).toEqual(1);
    });
    test('Should have sub-component Wrapper.Graph', () => {
      expect(component.find(Wrapper.Graph).length).toEqual(1);
    });
  });


  describe('<ChartTab /> Component', () => {
    let component;
    beforeEach(() => component = shallow(<ChartTab />));

    test('ChartTab Should Exist', () => {
      expect(component).toHaveLength(1);
    });
    test('Should have sub-components Tabs', () => {
      expect(component.find(Wrapper.Tab1D).length).toEqual(1);
      expect(component.find(Wrapper.Tab1W).length).toEqual(1);
      expect(component.find(Wrapper.Tab1M).length).toEqual(1);
      expect(component.find(Wrapper.Tab3M).length).toEqual(1);
      expect(component.find(Wrapper.Tab1Y).length).toEqual(1);
      expect(component.find(Wrapper.Tab5Y).length).toEqual(1);
    });
    test('Should have sub-component Wrapper.ChartTab', () => {
      expect(component.find(Wrapper.ChartTab).length).toEqual(1);
    });

    test('Should handle clicks on tabs', () => {
      const mockFunction = jest.fn();
      const component = mount(
        <ChartTab changeView={mockFunction} />,
      );
      component.find(Wrapper.Tab1D).simulate('click');
      component.find(Wrapper.Tab1W).simulate('click');
      component.find(Wrapper.Tab1M).simulate('click');
      component.find(Wrapper.Tab3M).simulate('click');
      component.find(Wrapper.Tab1Y).simulate('click');
      component.find(Wrapper.Tab5Y).simulate('click');
      expect(mockFunction).toHaveBeenCalledTimes(6);
      component.unmount();
    });
  });

  // TODO
  describe('<Header /> Component', () => {
    let component;
    beforeEach(() => component = shallow(<Header state={{
      view: '1D',
      historicPrice1D: [1, 2, 3, 4],
      name: tsExpressionWithTypeArguments,
      analystHold: 99,
      robinhoodOwners: 50000,
    }}
    />));

    test('Graph Should Exist', () => {
      expect(component).toHaveLength(1);
    });
    test('Should have sub-component header', () => {
      expect(component.find(Wrapper.Header).length).toEqual(1);
    });
    test('Should have sub-component headerTopContainer', () => {
      expect(component.find(Wrapper.HeaderTopContainer).length).toEqual(1);
    });
    test('Should have sub-component Company', () => {
      expect(component.find(Wrapper.Company).length).toEqual(1);
    });
    test('Should have sub-component HeaderTopButtons', () => {
      expect(component.find(Wrapper.HeaderTopButtons).length).toEqual(1);
    });
    test('Should have sub-component AnalystHold', () => {
      expect(component.find(Wrapper.AnalystHold).length).toEqual(1);
    });
    test('Should have sub-component RobinhoodOwners', () => {
      expect(component.find(Wrapper.RobinhoodOwners).length).toEqual(1);
    });
    test('Should have sub-component Ticker', () => {
      expect(component.find(Wrapper.Ticker).length).toEqual(1);
    });

    // test('Should calculate gain/loss correctly', () => {
    // 	expect(component.find(Wrapper.AnalystHold)).toBe('&emsp; ');
    // });
  });
});
