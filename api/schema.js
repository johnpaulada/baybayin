const schema = `
  type Query {
    fromImage(data: String, toLang: Language): Translation!
    fromText(text: String, fromLang: Language, toLang: Language): Baybayin!
  }

  type Mutation {
    login(input: UserLogin): String! 
    signup(input: UserSignup): String!
    generateToken: String!
  }

  enum Language {
    FILIPINO
  }

  union Baybayin = BaybayinData | BaybayinImage

  type BaybayinImage {
    url: String!
    text: String!
    language: String!
  }

  type BaybayinData {
    data: String!
    text: String!
    language: String!
  }

  type Translation {
    translatedText: String!
  }

  type User {
    name: String!
    username: String!
    isPro: Boolean!
    apiKey: String
  }

  input UserLogin {
    username: String!
    password: String!
  }

  input UserSignup {
    name: String!
    username: String!
    password: String!
    willGoPro: Boolean!
  }
`

module.exports = schema
