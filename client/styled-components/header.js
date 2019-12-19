import styled from 'styled-components';

const HeaderButton = styled.button`
  background: ${(props) => (props.backgroundColor === 'white' ? '#f4f4f5' : '#0e0d0d')};
  font-size: 13px;
  color: ${(props) => (props.backgroundColor === 'white' ? '#171718' : 'white')};
  border-radius: 15px
  border: none;
  padding: 0;
  height: 28px;
  font-family: "DINPro";
`;
const Header = styled.div`
  font-size: 36px;
  color: ${(props) => (props.backgroundColor === 'white' ? 'black' : 'white')};
`;
const Company = styled.span`
`;
const TagsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 18px;
`;
const Tags = styled.button`
  font-size: 13px;
  font-family: "DINPro-regular";
  background: ${(props) => {
    // console.log(props.backgroundColor);
    return props.backgroundColor === 'white' ? '#e6f9f3' : '#182b27';
  }};
  color: ${(props) => (props.lineColor === '#21ce99' ? '#21ce99' : '#f45531')};
  border-radius: 13px;
  border: none;
  height: 28px;
  vertical-align: middle;
  margin-right: 20px;
  :hover {
    color: #1b1b1d;
    background: ${(props) => (props.lineColor === '#21ce99' ? '#21ce99' : '#f45531')};
  }    
`;
const AnalystHoldTooltip = styled.span`
  font-family: "DINPro-regular";
  visibility: hidden;
  width: 149px;
  height: 38px;
  text-size: 13px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;
  margin-top: 30px;
  margin-left: -118px;
  position: absolute;
  z-index: 1;
`;
const AnalystHold = styled(HeaderButton)`
  background: ${(props) => (props.backgroundColor === 'white' ? '#f4f4f5' : '#0e0d0d')};
  font-size: 13px;
  color: ${(props) => (props.backgroundColor === 'white' ? '#171718' : 'white')};
  background-image: ${(props) => (props.backgroundColor === 'white' ? 'url(\'/graph/img/analyst-on.png\')' : 'url(\'/graph/img/analyst-off.png\')')};
  background-size: 13px 13px;
  background-repeat: no-repeat;
  background-position: 15% center;
  :hover {
    background: ${(props) => (props.backgroundColor === 'white' ? '#171718' : 'white')};
    color: ${(props) => (props.backgroundColor === 'white' ? 'white' : 'black')};
    background-image: ${(props) => (props.backgroundColor === 'white' ? 'url(\'/graph/img/analyst-off.png\')' : 'url(\'/graph/img/analyst-on.png\')')};
    background-size: 13px 13px;
    background-repeat: no-repeat;
    background-position: 15% center;
  }
  :hover ${AnalystHoldTooltip} {
    visibility: visible;
  }
`;
const RobinhoodOwnersTooltip = styled.span`
  font-family: "DINPro-regular";
  visibility: hidden;
  width: 149px;
  height: 38px;
  text-size: 13px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 5px;
  border-radius: 6px;
  margin-top: 30px;
  margin-left: -110px;
  position: absolute;
  z-index: 1;
`;
const RobinhoodOwners = styled(HeaderButton)`
  background: ${(props) => (props.backgroundColor === 'white' ? '#f4f4f5' : '#0e0d0d')};
  font-size: 13px;
  color: ${(props) => (props.backgroundColor === 'white' ? '#171718' : 'white')};
  background-image: ${(props) => (props.backgroundColor === 'white' ? 'url(\'/graph/img/owners-on.png\')' : 'url(\'/graph/img/owners-off.png\')')};
  background-size: 13px 13px;
  background-repeat: no-repeat;
  background-position: 17% center;
  :hover {
    background: ${(props) => (props.backgroundColor === 'white' ? '#171718' : 'white')};
    color: ${(props) => (props.backgroundColor === 'white' ? 'white' : 'black')};
    background-image: ${(props) => (props.backgroundColor === 'white' ? 'url(\'/graph/img/owners-off.png\')' : 'url(\'/graph/img/owners-on.png\')')};
    background-size: 13px 13px;
    background-repeat: no-repeat;
    background-position: 17% center;
  }
  :hover ${RobinhoodOwnersTooltip} {
    visibility: visible;
  }
`;
const HeaderTopContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  `;
const HeaderTopButtons = styled.div`
  font-family: "DINPro-regular";
  vertical-align: bottom;
  font-size: 16px;
  focus: {
    outline:none !important;
  }
`;
const FullTicker = styled.div`
  font-family: "DINPro-Light";
  font-size: 30px;
  z-index: 45;
`;
const Ticker = styled.div.attrs((/* props */) => ({ id: 'odometer' }))`
  font-family: "DINPro-Light";
  line-height: 26px;
  margin-top: -10px;
  font-weight: 650;
  font-size: 30px;
  z-index: 50;
`;
const GainLoss = styled.div`
  font-size: 13px;
  padding-top: 10px;
  width: 280px;
  `;
const ViewText = styled.span`
  font-size: 13px;
  color: #8c8c8e;
  font-family: "DINPro-Light"
  height: 15px;
`;

export {
  Header, Company, Tags, TagsContainer, AnalystHold, AnalystHoldTooltip, RobinhoodOwners, RobinhoodOwnersTooltip, HeaderTopContainer, HeaderTopButtons, Ticker, FullTicker, GainLoss, ViewText,
};
