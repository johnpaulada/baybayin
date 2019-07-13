const jwt = require("jsonwebtoken")
const { GraphQLServer } = require("graphql-yoga")
const { rule, shield, and, or, not } = require("graphql-shield")
const mongo = require("mongodb").MongoClient
const typeDefs = require("./schema")
const resolvers = require("./resolvers")

const MONGODB_URL = "mongodb://root:root@localhost:27017"
const MONGODB_DB = "baybayin"
const JWT_SECRET = "NOT_SO_SECRET"

const workOnDb = callback => {
  mongo.connect(MONGODB_URL, function(err, client) {
    const db = client.db(MONGODB_DB)
    callback(db)

    client.close()
  })
}

function getClaims(req) {
  try {
    const token = jwt.verify(req.request.get("Authorization"), JWT_SECRET)
    return token.claims
  } catch (e) {
    return null
  }
}

function getUsername(req) {
  try {
    const token = jwt.verify(req.request.get("Authorization"), JWT_SECRET, {
      algorithm: "HS256"
    })
    return token.username
  } catch (e) {
    return null
  }
}

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
  return Boolean(ctx.username)
})

const permissions = shield({
  Query: {
    fromImage: isAuthenticated,
    fromText: isAuthenticated
  },
  Mutation: {
    signup: not(isAuthenticated),
    login: not(isAuthenticated),
    generateToken: isAuthenticated
  }
})

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    workOnDb,
    claims: getClaims(req),
    username: getUsername(req)
  }),
  middlewares: [permissions]
})

server.start(() => console.log("Server is running on localhost:4000"))
