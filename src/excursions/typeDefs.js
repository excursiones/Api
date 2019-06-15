export const excursionsTypeDef = `
type Excursion {
    id: Int
    name: String!
    price: Int
    location: String
    description: String!
    photo_path: String
    duration: Int
    state: Int
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
    state: Int
}
input ExcursionDurationInput {
    maximum_duration: Int!
}
input ExcursionLocationInput {
    location: String!
}
input ExcursionPriceInput {
    maximum_price: Int!
}`;

export const excursionsQueries = `
    allExcursions: [Excursion]!
    allPackages: [Excursion]!
    excursionById(id: Int!): Excursion!
    excursionByDuration(duration: ExcursionDurationInput!): [Excursion]!
    excursionByLocation(location: ExcursionLocationInput!): [Excursion]!
    excursionByPrice(price: ExcursionPriceInput!): [Excursion]!
`;

export const excursionsMutations = `
    createExcursion(excursion: ExcursionCreationInput!): Excursion
    deleteExcursion(id: Int!): Int
    updateExcursion(id: Int!, excursion: ExcursionEditionInput!): Excursion
`;
