export const excursionsTypeDef = `
type Excursion {
    id: Int!
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
    state: Int!
}
input ExcursionCreationInput {
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
}
input ExcursionEditionInput {
    name: String!
    price: Int!
    location: String!
    description: String!
    photo_path: String!
    duration: Int!
    state: Int!
}`;


export const excursionsQueries = `
allExcursions: [Excursion]
excursionById(id: Int!): Excursion!
excursionByDuration(duration: Int!): [Excursion]!
excursionByLocation(location: String!): [Excursion]!
excursionByPrice(price: Int!): [Excursion]!
`;

export const excursionsMutations = `
createExcursion(excursion: ExcursionCreationInput!): Excursion!
deleteExcursion(id: Int!): Excursion!
updateExcursion(id: Int!, excursion: ExcursionEditionInput!): Excursion!
`;


// ----------------------------- Packages-----------------------------

export const packagesTypeDef = `
type Package{
    id_packages: Int
    name: String!
    price: Int!
    id_excursions: Int
    state: Int!
}

input CreatePackageInput {
    name: String!
    price: Int!
    excursions: [Int]
}

input EditPackageInput {
    name: String!
    price: Int!
    state: Int!
}`;

export const PackagesQueries = `
allPackages: [Package]!
packageById(id: Int!): Package!
packageByPrice(price: Int!): [Package]!
`;

export const packagesMutations = `
createPackage(pack: CreatePackageInput!): Package!
deletePackage(id: Int!): Package!
updatePackage(id: Int!, pack: EditPackageInput!): Package
`;
