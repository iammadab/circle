;(async function(){
  
  const urlParams = new URLSearchParams(window.location.search)
  const email = urlParams.get("email")

  const transactions = await api({ query: `query{
    transactions(email: "${email}"){
      id,
      status,
      amount,
      currency
     }}`
  })

  let display = `<h1>History for ${email}</h1>`
  transactions.data.transactions.forEach(transaction => {
   display += buildTransaction(transaction)
  })

  document.body.innerHTML = display

})()

function buildTransaction(transactionObj){
  return `<div class="card">
  <div class="card-body">
    <h5 class="card-title">Transaction ${transactionObj.id}</h5>
    <p>Amount: ${transactionObj.amount}</p>
    <p>Currency: ${transactionObj.currency}</p>
    <p>Status: ${transactionObj.status}</p>
  </div>
  </div>
  `
}

function api(data){
    return fetch("/graphql", {
          method: "POST", 
          headers: {
                  "Content-Type": "application/json"
                },
          body: JSON.stringify(data)
        }).then(response => response.json())
}
