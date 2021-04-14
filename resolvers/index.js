const pubkeyResolver = require("./pubkey")
const transactionResolver = require("./transactions")
const chargeCardResolver = require("./chargeCard")

const resolvers = {
  pubkey: pubkeyResolver,
  transactions: transactionResolver,
  chargeCard: chargeCardResolver  
}

module.exports = resolvers
