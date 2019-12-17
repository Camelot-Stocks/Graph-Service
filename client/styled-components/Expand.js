import styled from 'styled-components';

const Image = styled.div`
  
`;

const Expand = styled.div`
  background-image: ${(props) => (props.backgroundColor === 'white' ? 'url(\'/graph/img/expand-black.png\')' : 'url(\'/graph/img/expand-white.png\')')};
  color: ${(props) => (props.backgroundColor === 'white' ? 'black' : 'white')};
  background-size: 13px 13px;
  background-repeat: no-repeat;
  background-position: 90% center;
  height: 35px;
  margin-bottom: -2px;
  line-height: 35px;
  font-family: "DINPro";
  :hover {
    color: ${(props) => props.lineColor};
    background-image: ${(props) => (props.lineColor === '#21ce99' ? 'url("/graph/img/expand-on-gain.png")' : 'url("/graph/img/expand-on-loss.png")')};
    background-size: 13px 13px;
    background-repeat: no-repeat;
    background-position: 90% center;
  }
`;

export { Image, Expand };
