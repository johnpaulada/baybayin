import gql from "graphql-tag"
import React from "react"
import { Query } from "react-apollo"
import { Text, View } from "react-native"

const TextFromBaybayin = gql`
  query FromBaybayin($base64: String!) {
    fromImage(data: $base64, toLang: FILIPINO) {
      translatedText
    }
  }
`

const ResultsScreen = ({ navigation }) => {
  const base64 = navigation.getParam("base64", "")
  return (
    <View style={{ flex: 1 }}>
      <Query query={TextFromBaybayin} variables={{ base64 }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return []
          if (error) {
            console.log(error)
            return []
          }
          return (
            <View style={{ padding: 50 }}>
              <Text>{data ? data.fromImage.translatedText : ""}</Text>
            </View>
          )
        }}
      </Query>
    </View>
  )
}

export default ResultsScreen
