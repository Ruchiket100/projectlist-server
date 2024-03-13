export const mutations = `#graphql
    createProject (title: String!, description: String!, screenshots: [String], link:String, icon:String, github: String) : payload
    deleteProject (id: ID!) : payload
    updateProject (id: ID!, title: String, description: String, screenshots: [String], link:String, icon:String, github: String) : payload
`
