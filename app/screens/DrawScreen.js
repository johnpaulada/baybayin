import React from "react"
import { View } from "react-native"

const DrawScreen = ({ navigation }) => {
  return <View style={{ flex: 1 }} />
}

DrawScreen.navigationOptions = () => ({
  title: "Draw Baybayin Here!"
})

export default DrawScreen
