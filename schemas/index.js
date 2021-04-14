const { buildSchema } = require("graphql")

const schema = buildSchema(`
    input MetaData{
      email: String!
    }

    input Billing{
      name: String!,
      city: String,
      country: String,
      line1: String,
      postalCode: String,
      district: String
    }
    
    input ChargeInput{
      keyId: String!,
      encryptedData: String!,
      billingDetails: Billing!,
      expMonth: String!,
      expYear: String!,
      metadata: MetaData!,
      amount: String!,
      currency: String!
    }

    type Transaction{
      email: String!,
      id: String!,
      status: String!,
      amount: String!,
      currency: String!
    }

    type EncryptionKey{
      keyId: String!,
      publicKey: String!
    }

    type RootQuery{
      pubkey: EncryptionKey!,
      transactions(email: String!): [Transaction!]!
    }

    type RootMutation{
      chargeCard(chargeInput: ChargeInput!): Transaction!
    }

    schema {
      query: RootQuery,
      mutation: RootMutation
    }
`)

module.exports = schema
