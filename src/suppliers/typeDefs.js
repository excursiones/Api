export const suppliersTypeDef = `
type Supplier {   
    id: Int
    Codigo: Int
    Nit: Int
    Razon: String
    Telefono: String
    Correo: String
    Ubicacion: String
}
input SupplierInput {
    Codigo: Int
    Nit: Int
    Razon: String
    Telefono: String
    Correo: String
    Ubicacion: String
}`;

export const suppliersQueries = `
    allSuppliers: [Supplier]
    supplierById(id: Int!): Supplier
    supplierAccount(id: Int!): Account
    
`;

export const suppliersMutations = `
    createSupplier(supplier: SupplierInput!): Supplier!
    deleteSupplier(id: Int!): Int!
    updateSupplier(id: Int!, supplier: SupplierInput!): Supplier!
`;
export const accountsTypeDef = `
type Account {    
    id: Int!
    Cuentas_por_pagar: Int!
    Cuentas_pagadas: Int!
    Intereses_por_pagar: Int!
    supplier_id: Int!
}
type DebtTotal {    
    Total_ctas_por_pagar: Int    
    Total_Int_por_pagar: Int    
}
input AccountInput {
    Cuentas_por_pagar: Int
    Cuentas_pagadas: Int
    Intereses_por_pagar: Int
    supplier_id: Int
}`;

export const accountsQueries = `
    allAccounts: [Account]
    accountById(id: Int!): Account
    totalDebts: DebtTotal
`;

export const accountsMutations = `
    createAccount(account: AccountInput!): Account!
    deleteAccount(id: Int!): Int
    updateAccount(id: Int!, account: AccountInput!): Account!
`;


