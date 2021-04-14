function connectToDb(){
  const mongoose = require("mongoose")
  const dbName = "default"

  let uri = `mongodb://madab:${process.env.DBPASS}@cluster0-shard-00-00.fsdff.mongodb.net:27017,cluster0-shard-00-01.fsdff.mongodb.net:27017,cluster0-shard-00-02.fsdff.mongodb.net:27017/${dbName}?ssl=true&replicaSet=atlas-l2dk1c-shard-0&authSource=admin&retryWrites=true&w=majority`

  return mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Connected to online db"))
        .catch(err => console.log("Error connecting to online db", err))
}

module.exports = connectToDb
