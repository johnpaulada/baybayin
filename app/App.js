import React from "react"
import { ApolloProvider } from "react-apollo"
import client from "./client"
import Routes from "./routes"

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Routes />
    </ApolloProvider>
  )
}

export default App
