import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTservice from "../../services/jwt";
import bcrypt from "bcrypt";

const queries = {
    async sayHello(name: string) { return `Hello, ${name}!` },
}
const mutations = {
    async createUser(_parent: any, {name,email,password} : {name:string, email : string, password: string}) {
        // check is the email is unique
        const isExist = await prismaClient.user.findUnique({
            where: {email: email}
        })
        //if not give me error and return error message
        if(isExist){
            return {
                success: false,
                message: "user already exists"
            }
        }
        //else register the user and return the token
        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPass,
            }
        })

        const token = JWTservice.generateUserToken(newUser)

        return {
            token,
            success: true,
            message: 'user signed up successfully'
        }
    }
}

export const resolvers = { queries, mutations }
