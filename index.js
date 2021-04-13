require("dotenv").config()
const axios = require("axios")
const openpgp = require("openpgp")
const atob = require("atob")
const btoa = require("btoa")
const { v4: uuidv4 } = require("uuid")

const headers = {
  'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}`
}

;(async function(){

  // Encrypt the user card details
 
  const result = await axios.get("https://api-sandbox.circle.com/v1/encryption/public", { headers })
  if(result.status != 200)
    return console.log("Error getting key")

  const pciEncryptionKey = result.data.data
  const decodedPubKey = atob(pciEncryptionKey.publicKey)

  const cardDetails = {
    number: 4007400000000007,
    cvv: 123
  }

  const options = {
    message: openpgp.message.fromText(JSON.stringify(cardDetails)),
    publicKeys: (await openpgp.key.readArmored(decodedPubKey)).keys
  }

  const data = await openpgp.encrypt(options).then((ciphertext) => {
    return {
      encryptedData: btoa(ciphertext.data),
      keyId: pciEncryptionKey.keyId
    }
  })


  // Save the user card details

  const d = {
    idempotencyKey: uuidv4(),
    keyId: data.keyId,
    encryptedData: data.encryptedData,
    billingDetails: {
      name: "Satoshi Nakamoto",
      city: "Boston",
      country: "US",
      line1: "100 Money Street",
      postalCode: 01234,
      district: "MA"
    },
    expMonth: 10,
    expYear: 2020,
    metadata: {
      email: "iammadab@gmail.com",
      sessionId: uuidv4(), // Change this to something better
      ipAddress: "244.28.239.130"
    }
  }

  const createCardResult = await axios.post("https://api-sandbox.circle.com/v1/cards", d, { headers })
  const cardId = createCardResult.data.data.id


  // Create card payment
  const createPaymentData = {
    idempotencyKey: uuidv4(),
    keyId: data.keyId,
    metadata: {
      email: "iammadab@gmail.com",
      sessionId: uuidv4(),
      ipAddress: "244.28.239.130"
    },
    amount: {
      amount: 3.14,
      currency: "USD"
    },
    verification: "none",
    source: {
      id: cardId,
      type: "card"
    },
    description: "Payment"
  }

  //const createPaymentResult = await axios.post("https://api-sandbox.circle.com/v1/payments", createPaymentData, { headers })
  //console.log(createPaymentResult)
  //
  
  console.log(await axios.get("https://api-sandbox.circle.com/v1/payments/"+ "765c11ba-b289-4b7c-b465-e9a9a91a0fd1", { headers } ))

})()
