
import { prismaClient } from "../clients/db";
import JWTservice from "../../services/jwt";
import bcrypt from "bcrypt";
import crypto from "crypto";

const queries = {
    async sayHello(name: string) {
        console.log(name);
        const data = await `Hello, ${name}!`
        return data;
    },
}

//changes here
const mutations = {
    async signup(_parent: any, { name, email, password }: { name: string, email: string, password: string }) {
        if (!email) return console.log(email)
        // check is the email is unique
        const isExist = await prismaClient.user.findUnique({
            where: { email: email }
        })
        console.log(isExist)
        //if not give me error and return error message
        if (isExist) {
            return {

                success: false,
                message: "user already exists"
            }
        }
        //else register the user and return the token
        const hashedPass = await bcrypt.hash(password, 10)

        // generate unique username
        const key = crypto.randomBytes(32);
        const username = `PROJECT_LIST${key.toString('hex')}`

        const newUser = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPass,
                username: username
            }
        })

        const token = JWTservice.generateUserToken(newUser)

        return {
            token,
            success: true,
            message: 'user signed up successfully'
        }
    },

    async login(_parent: any, { email, username, password }: { email?: string, username?: string, password: string }) {
        //check if the user exists
        const isExsist = await prismaClient.user.findUnique({ where: username ? { username: username } : { email: email } })
        //if not return error
        if (!isExsist) return {
            success: false,
            message: "user not found"
        }
        // check if the password is correct
        const isCorrect = await bcrypt.compare(password, isExsist.password)
        //if not return error
        if (!isCorrect) return {
            success: false,
            message: "wrong password"
        }
        //else return the token
        return {
            token: JWTservice.generateUserToken(isExsist),
            success: true,
            message: "user logged in successfully"
        }
    }
}

export const resolvers = { queries, mutations }
