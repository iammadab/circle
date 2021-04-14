const Transaction = require("../models/transaction.model")

const transactions = async ({ email }) => {
  const transactions = await Transaction.find({ email }).sort({ _id: -1 })
  return transactions
}

module.exports = transactions
