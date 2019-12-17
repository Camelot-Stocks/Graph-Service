import styled from 'styled-components';


const App = styled.div`
  background: ${(props) => props.backgroundColor}
  font-family: "DINPro-regular";
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 676px;
  padding: 36px 36px 50px;
  font-size: 13px;
`;

export { App };
