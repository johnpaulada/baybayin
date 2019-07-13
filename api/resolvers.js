const jwt = require("jsonwebtoken")
const fetch = require("isomorphic-fetch")
const FormData = require('form-data')
const JWT_SECRET = "NOT_SO_SECRET"
const ML_API_URL = "http://localhost:5000/fromImage/"

const generateTranslators = () => {
  const translatorMap = new Map()
  translatorMap.set("FILIPINO-FILIPINO", text => text)

  return translatorMap
}

const translators = generateTranslators()

const inferLanguage = _text => "FILIPINO"

const requestBaybayinOcr = async ({ _url, data }) => {
  const formData = new FormData()
  formData.append("b64", data)

  const response = await fetch(ML_API_URL, {
    method: "POST",
    body: formData
  })

  const base64 = await response.text()

  return base64
}

const passwordHashing = password => password

const resolvers = {
  Query: {
    fromImage: async (_, { data, toLang }) => {
      const baybayinText = await requestBaybayinOcr({ data })
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
