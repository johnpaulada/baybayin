import { Router } from "@reach/router"
import React from "react"
import "./App.css"
import LandingPage from "./pages/LandingPage"

function App() {
  return (
    <Router>
      <LandingPage path="/" />
    </Router>
  )
}

export default App
