const jwt = require("jsonwebtoken")

const JWT_SECRET = "NOT_SO_SECRET"

const generateTranslators = () => {
  const translatorMap = new Map()
  translatorMap.set("FILIPINO-FILIPINO", text => text)

  return translatorMap
}

const translators = generateTranslators()

// TODO: Infer language
const inferLanguage = _text => "FILIPINO"

// TODO: Request from ML Server
const requestBaybayinOcr = ({ _url, data }) => {
  return "bagsik"
}

const passwordHashing = password => password

const resolvers = {
  Query: {
    fromImage: (_, { data, toLang }) => {
      const baybayinText = requestBaybayinOcr({ data })
      const fromLang = inferLanguage(baybayinText)
      const translatorKey = `${fromLang}-${toLang}`
      const translator = translators.get(translatorKey)
      const translatedText = translator(baybayinText)

      return {
        translatedText
      }
    },
    fromText: (_, args) => {
      return {
        data: "",
        text: "",
        language: ""
      }
    }
  },
  Mutation: {
    signup: (_, { input: { name, username, password } }, { workOnDb }) => {
      return new Promise((resolve, reject) => {
        workOnDb(db => {
          const users = db.collection("users")
          users.insertOne(
            { name, username, password: passwordHashing(password) },
            (err, _result) => {
              if (err) {
                reject(err)
              }

              const token = jwt.sign({ username }, JWT_SECRET, {
                algorithm: "HS256"
              })

              resolve(token)
            }
          )
        })
      })
    },
    login: (_, { input: { username, password } }, { workOnDb }) => {
      return new Promise((resolve, reject) => {
        workOnDb(db => {
          const users = db.collection("users")
          users.findOne(
            { username, password: passwordHashing(password) },
            (err, _item) => {
              if (err) {
                reject(err)
              }

              const token = jwt.sign({ username }, JWT_SECRET, {
                algorithm: "HS256"
              })

              resolve(token)
            }
          )
        })
      })
    },
    generateToken: (_, __) => {}
  },
  Baybayin: {
    __resolveType: obj => {
      console.log(obj)

      return null
    }
  }
}

module.exports = resolvers
