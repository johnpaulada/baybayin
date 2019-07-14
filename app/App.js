import * as Font from "expo-font"
import React, { useEffect } from "react"
import { ApolloProvider } from "react-apollo"
import client from "./client"
import Routes from "./routes"

const App = () => {
  useEffect(() => {
    Font.loadAsync({
      nunito: require("./assets/fonts/Nunito/Nunito-Regular.ttf"),
      "nunito-black": require("./assets/fonts/Nunito/Nunito-Black.ttf"),
      "nunito-light": require("./assets/fonts/Nunito/Nunito-Light.ttf")
    })
  }, [])

  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  )
}

export default App
