export const suppliersTypeDef = `
type Supplier {    
    Codigo: Int!
    Nit: Int!
    Razon: String!
    Telefono: String!
    Correo: String!
    Ubicacion: String!

}
input SupplierInput {
    Codigo: Int!
    Nit: Int!
    Razon: String!
    Telefono: String!
    Correo: String!
    Ubicacion: String!
}`;

export const suppliersQueries = `
    allSuppliers: [Supplier]!
    supplierById(id: Int!): Supplier!
    supplierAccount(id: Int!): Account!
    
`;

export const suppliersMutations = `
    createSupplier(supplier: SupplierInput!): Supplier!
    deleteSupplier(id: Int!): Int!
    updateSupplier(id: Int!, suppiler: SupplierInput!): Supplier!
`;
export const accountsTypeDef = `
type Account {    
    Cuentas_por_pagar: Int!
    Cuentas_pagadas: Int!
    Intereses_por_pagar: Int!
    supplier_id: Int!
}
input AccountInput {
    Cuentas_por_pagar: Int!
    Cuentas_pagadas: Int!
    Intereses_por_pagar: Int!
    supplier_id: Int!
}`;

export const accountsQueries = `
    allAccounts: [Account]!
    accountById(id: Int!): Account!
`;

export const accountsMutations = `
    createAccount(account: AccountInput!): Account!
    deleteAccount(account: Int!): Int
    updateAccount(account: Int!, account: AccountInput!): Account!
`;


