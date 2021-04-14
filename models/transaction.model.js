const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  id: { type: String, required: true },
  status: { type: String, enum: [ "pending", "confirmed", "paid"], default: "pending" },
  amount: { type: String, required: true },
  currency: { type: String, required: true }
})

const transactionModel = mongoose.model("Transaction", transactionSchema)

module.exports = transactionModel
