import { createAppContainer, createStackNavigator } from "react-navigation"
import { DrawScreen, HomeScreen, ResultsScreen } from "./screens"

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  },
  Results: {
    screen: ResultsScreen
  },
  Draw: {
    screen: DrawScreen
  }
})

const Routes = createAppContainer(AppNavigator)

export default Routes
