export const loginTypeDef = `
input LoginInput {
    username: String!
    password: String!
}`;

export const loginQueries = `
`;

export const loginMutations = `
    login(credentials: LoginInput!): String!
`;
