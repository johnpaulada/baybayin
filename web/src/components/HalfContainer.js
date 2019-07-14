import styled from "styled-components"

const HalfContainer = styled.div`
  width: 50vw;
  height: 100vh;
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props =>
    "color" in props && props.color ? props.color : "#333"};
`

export default HalfContainer
