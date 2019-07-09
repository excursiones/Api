export const SignInAndSignUpTypeDef = `
type Token {
    token: String!
}

input SignInAuth {
    email: String!
    password: String!
}

input SignUpAuth {
    email: String!
    password: String!
    name: String!
}

input SignInCredentials {
    auth: SignInAuth!
}

input SignUpCredentials {
    auth: SignUpAuth!
}`;

export const SignInAndSignUpQueries = `
`;

export const SignInAndSignUpMutations = `
    sign_in(signInCredentials: SignInCredentials!): Token
    sign_up(signUpCredentials: SignUpCredentials!): String
`;
