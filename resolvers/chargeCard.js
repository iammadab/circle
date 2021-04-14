const { v4: uuidv4 } = require("uuid")
const axios = require("axios")
const Transaction = require("../models/transaction.model")

const baseUrl = "https://api-sandbox.circle.com/v1"
const headers = { 'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}` }

const chargeCard = async ({ chargeInput }) => {

  // Save card
  const saveCardDetails = {
    idempotencyKey: uuidv4(),
    keyId: chargeInput.keyId,
    encryptedData: chargeInput.encryptedData,
    billingDetails: chargeInput.billingDetails,
    expMonth: chargeInput.expMonth,
    expYear: chargeInput.expYear,
    metadata: {
      email: chargeInput.metadata.email,
      sessionId: uuidv4(),
      ipAddress: "244.28.239.130"
    }
  }

  const createCardResult = await axios.post(baseUrl + "/cards", saveCardDetails, { headers })
  const cardId = createCardResult.data.data.id

  // Create card payment
  const createCardPaymentData = {
    idempotencyKey: uuidv4(),
    keyId: chargeInput.keyId,
    metadata: {
      email: chargeInput.metadata.email,
      sessionId: uuidv4(),
      ipAddress: "244.28.239.130"
    },
    amount: {
      amount: chargeInput.amount,
      currency: chargeInput.currency
    },
    verification: "none",
    source: {
      id: cardId,
      type: "card"
    },
    description: "Payment"
  }

  const chargeResponse = await axios.post(baseUrl + "/payments", createCardPaymentData, { headers })
  const chargeData = chargeResponse.data.data

  const transaction = new Transaction({
    email: chargeInput.metadata.email,
    id: chargeData.id,
    status: chargeData.status,
    amount: chargeData.amount.amount,
    currency: chargeData.amount.currency
  })

  await transaction.save()

  return { 
    email: transaction.email, 
    id: transaction.id, 
    status: transaction.status, 
    amount: transaction.amount, 
    currency: transaction.currency 
  }

}

module.exports = chargeCard
