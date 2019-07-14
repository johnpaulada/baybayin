import styled from "styled-components"

const TitleText = styled.h1`
  font-weight: 900;
  font-size: 3em;
  color: ${props =>
    "color" in props && props.color ? props.color : "#fafafa"};
`

export default TitleText
