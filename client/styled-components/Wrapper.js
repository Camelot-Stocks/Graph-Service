import {
  ChartTab, Tab1D, Tab1W, Tab1M, Tab3M, Tab1Y, Tab5Y,
} from './ChartTab.js';
import { App } from './App';
import { Expand, Image } from './Expand';
import { Graph, Chart, GraphBottomContainer } from './Graph';
import {
  Header, Company, Tags, TagsContainer, AnalystHold, AnalystHoldTooltip, RobinhoodOwners, RobinhoodOwnersTooltip, HeaderTopContainer, HeaderTopButtons, Ticker, FullTicker, GainLoss, ViewText,
} from './Header';

const Wrapper = {};
Wrapper.App = App;
Wrapper.ChartTab = ChartTab;
Wrapper.Tab1D = Tab1D;
Wrapper.Tab1W = Tab1W;
Wrapper.Tab1M = Tab1M;
Wrapper.Tab3M = Tab3M;
Wrapper.Tab1Y = Tab1Y;
Wrapper.Tab5Y = Tab5Y;

Wrapper.Image = Image;
Wrapper.Expand = Expand;

Wrapper.Graph = Graph;
Wrapper.Chart = Chart;
Wrapper.GraphBottomContainer = GraphBottomContainer;

Wrapper.Header = Header;
Wrapper.Company = Company;
Wrapper.Tags = Tags;
Wrapper.TagsContainer = TagsContainer;
Wrapper.AnalystHold = AnalystHold;
Wrapper.AnalystHoldTooltip = AnalystHoldTooltip;
Wrapper.RobinhoodOwners = RobinhoodOwners;
Wrapper.RobinhoodOwnersTooltip = RobinhoodOwnersTooltip;
Wrapper.HeaderTopContainer = HeaderTopContainer;
Wrapper.HeaderTopButtons = HeaderTopButtons;
Wrapper.FullTicker = FullTicker;
Wrapper.Ticker = Ticker;
Wrapper.GainLoss = GainLoss;
Wrapper.ViewText = ViewText;

export default Wrapper;
