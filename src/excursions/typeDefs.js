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
    name: String
    price: Int
    location: String
    description: String
    photo_path: String
    duration: Int
}
input ExcursionEditionInput {
    name: String
    price: Int
    location: String
    description: String
    photo_path: String
    duration: Int
    state: Int
}`;

export const excursionsQueries = `
    allExcursions: [Excursion]
    excursionById(id: Int!): Excursion
    excursionByDuration(duration: Int!): [Excursion]
    excursionByLocation(location: String!): [Excursion]
    excursionByPrice(price: Int!): [Excursion]
`;

export const excursionsMutations = `
    createExcursion(excursion: ExcursionCreationInput!): Excursion
    deleteExcursion(id: Int!): Int
    updateExcursion(id: Int!, excursion: ExcursionEditionInput!): Excursion
`;
