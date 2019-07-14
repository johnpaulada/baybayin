import React from "react"
import FullContainer from "../components/FullContainer"
import HalfContainer from "../components/HalfContainer"
import TitleText from "../components/TitleText"
const LandingPage = () => {
  return (
    <FullContainer>
      <HalfContainer color="#FF5126">
        <TitleText>Baybayin API Platform</TitleText>
      </HalfContainer>
      <HalfContainer color="#3366FF" />
    </FullContainer>
  )
}

export default LandingPage
