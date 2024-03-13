export const types = `#graphql
    type User {
        id: ID!
        username: String!
        fullname: String
        email: String!
        profileImageUrl: String
    }

    type AuthPayload {
        token: String
        success: Boolean!
        message: String
    }
`