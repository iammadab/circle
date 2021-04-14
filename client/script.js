const store = {
  prefill: document.querySelector(".prefill-button"),
  chargeButton: document.querySelector(".charge"),
  inputs: Array.from(document.querySelectorAll("input"))
}

;(function attachEvents(){
  store.prefill.onclick = prefillInput
  store.chargeButton.onclick = chargeCard
})()

const defaults = {
  email: "trustless@gmail.com",
  cardnumber: 4007400000000007,
  cvv: 123,
  expmonth: 10,
  expyear: 2020,
  name: "Vitalik Buterin",
  city: "Boston", 
  country: "US",
  line1: "100 Money Street", 
  postalcode: 1234,
  district: "MA",
  currency: "USD",
  amount: 10
}

function prefillInput(event){
  store.inputs.forEach(input => {
    if(defaults[input.dataset.name])
      input.value = defaults[input.dataset.name]
  })
}

async function chargeCard(){

  store.chargeButton.innerText = "Charging..."

  // Encrypt card details
  const encryptedCard = await encryptCardDetails()
  
  // Send encrypted details plus other info
  const chargeCardResponse = await api({
    query: `mutation{
      chargeCard(chargeInput: { 
        keyId: "${encryptedCard.keyId}",
        encryptedData: "${encryptedCard.encryptedData}",
        billingDetails: {
          name: "${getValue('name')}",
          city: "${getValue('city')}",
          country: "${getValue('country')}",
          line1: "${getValue('line1')}",
          postalCode: "${getValue('postalcode')}",
          district: "${getValue('district')}"
        },
        expMonth: "${getValue('expmonth')}",
        expYear: "${getValue('expyear')}",
        metadata: {
          email: "${getValue('email')}"
        },
        amount: "${getValue('amount')}",
        currency: "${getValue('currency')}"
      }){
        status
      }
    }`
  })

  // On transaction creation, send the user to the history page
  window.location.href = `/history?email=${getValue('email')}`

}

async function encryptCardDetails(){

  // Fetch the public key from the server
  const pubkeyResponse = await api({
    query: `query{
      pubkey{
       keyId,
       publicKey
      }
    }`
  })

  // Setup openpgp encryption
  const pciEncryptionKey = pubkeyResponse.data.pubkey
  const decodedPubKey = atob(pciEncryptionKey.publicKey)

  const cardDetails = {
    number: getValue("cardnumber"),
    cvv: getValue("cvv")
  }

  const options = {
    message: openpgp.message.fromText(JSON.stringify(cardDetails)),
    publicKeys: (await openpgp.key.readArmored(decodedPubKey)).keys
  }

  // Encrypt the card details
  const data = await openpgp.encrypt(options).then((ciphertext) => {
    return {
      encryptedData: btoa(ciphertext.data),
      keyId: pciEncryptionKey.keyId
    }
  })

  return data
}



// Helper functions

// Using this to extract values from the dom
function getValue(name){
  const input = document.querySelector(`[data-name=${name}]`)
  return input.value
}

// Helper function to request api endpoints
function api(data){
    return fetch("/graphql", {
          method: "POST", 
          headers: {
                  "Content-Type": "application/json"
                },
          body: JSON.stringify(data)
        }).then(response => response.json())
}
