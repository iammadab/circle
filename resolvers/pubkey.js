// Gets the public key for encryption of the user card details

const axios = require("axios")
const headers = { 'Authorization': `Bearer ${process.env.CIRCLE_API_KEY}` }
const baseUrl = "https://api-sandbox.circle.com/v1"

const pubkey = async () => {

  console.log(headers)
  const pubkeyResult = await axios.get(baseUrl + "/encryption/public", { headers }).catch(console.log)
  if(pubkeyResult.status != 200)
    throw new Error("Error getting key")

  return pubkeyResult.data.data

}

module.exports = pubkey
