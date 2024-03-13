
export const types = `#graphql
type Project {
    id: ID!
    title: String!
    description: String!
    screenshots: [String]
    link: String
    author: User
    authorId: ID!
    icon: String
    github: String
    upvote_count: Int
    downvote_count: Int
    url: String!

}

type payload {
    data: Project
    results: [Project]
    success: Boolean!
    message: String
}
`