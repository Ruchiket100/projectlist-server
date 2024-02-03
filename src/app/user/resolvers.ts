import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTservice from "../../services/jwt";

const queries = {
    async sayHello(name: string) { return `Hello, ${name}!` },
}
const mutations = {
    async createUser(_parent: any, { token }: { token: string }) {
        const client_id = "331b1ce610f3254b6430"
        const res = await fetch(`https://api.github.com/applications/${client_id}/tokens/${token}`)
        console.log(res)
        return token;
    }
}

export const resolvers = { queries, mutations }
