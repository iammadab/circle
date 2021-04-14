require("dotenv").config()

const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")

const connectToDb = require("./connectToDb")
connectToDb()

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.resolve("./client")))

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./client/index.html"))
})

app.get("/history", (req, res) => {
  res.sendFile(path.resolve("./client/history.html"))
})


const schema = require("./schemas")
const resolvers = require("./resolvers")

app.use("/graphql", graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true
}))

app.get("/webhook", (req, res) => {
  console.log(req)
  res.status(200).json({})
})


app.listen(5000, () => {
  console.log("Application listening at port 5000")
})
