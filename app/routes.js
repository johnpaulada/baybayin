import { createAppContainer, createStackNavigator } from "react-navigation"
import { HomeScreen, ResultsScreen } from "./screens"

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Results: {
    screen: ResultsScreen
  }
})

const Routes = createAppContainer(AppNavigator)

export default Routes
