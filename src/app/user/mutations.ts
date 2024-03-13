export const mutations = `#graphql
    signup(name: String!, email:String!, password: String!) : AuthPayload
    login(username: String!, password: String!) : AuthPayload
    `;