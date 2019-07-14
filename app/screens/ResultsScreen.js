import gql from "graphql-tag"
import React, { Fragment } from "react"
import { Query } from "react-apollo"
import { View } from "react-native"
import DescriptionText from "../components/DescriptionText"
import DescriptionView from "../components/DescriptionView"
import ImageView from "../components/ImageView"
import Loading from "../components/Loading"
import LoadingText from "../components/LoadingText"

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
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <Query query={TextFromBaybayin} variables={{ base64 }}>
        {({ loading, error, data, refetch }) => {
          if (loading)
            return (
              <Loading>
                <LoadingText>LOADING...</LoadingText>
              </Loading>
            )

          if (error) {
            console.log(error)
            return []
          }
          return (
            <Fragment>
              <ImageView />
              <DescriptionView>
                <DescriptionText>
                  {data ? data.fromImage.translatedText : ""}
                </DescriptionText>
              </DescriptionView>
            </Fragment>
          )
        }}
      </Query>
    </View>
  )
}

export default ResultsScreen
