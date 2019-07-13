import ApolloClient from "apollo-boost"

const client = new ApolloClient({
  uri: "http://192.168.80.132:4000",
  headers: {
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplcGUiLCJpYXQiOjE1NjMwNTE0MDV9.NBUY4P8jpT9UzEg7JAEuapToq7fI13LbWgZAJpn0IlA"
  }
})

export default client
