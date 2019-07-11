export const transactionsTypeDef = `
type CompanyPayment {
    id: Int!
    company_id: Int!
    price: Int!
    date: String!
    origin_account: String!
    destination_account: String!
}
input CompanyPaymentInput {
    company_id: Int!
    price: Int!
    origin_account: String!
    destination_account: String!
}
input Refund {
    id: Int!
    transaction_id: Int!
    date: String!
}
type UserPayment {
    id: Int!
    user_id: Int!
    price: Int!
    date: String!
    origin_account: String!
    destination_account: String!
}
input UserPaymentInput {
    user_id: Int!
    price: Int!
    origin_account: String!
    destination_account: String!
}
`;

export const transactionsQueries = `
    allCompanyPayments: [CompanyPayment]
    allUserPayments: [UserPayment]
    allUserRefunds: [UserPayment]
`;

export const transactionsMutations = `
    createCompanyPayment(company_payment: CompanyPaymentInput!): CompanyPayment
    createUserPayment(user_payment: UserPaymentInput!): UserPayment
`;
