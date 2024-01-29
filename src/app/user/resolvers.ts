import axios from "axios";
import { prismaClient } from "../clients/db";
import JWTservice from "../../services/jwt";

type TokenData = {
    iss?: string;
    azp?: string;
    aud?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
    nbf?: string;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
    iat?: string;
    exp?: string;
    jti?: string;
    alg?: string;
    kid?: string;
    typ?: string;
};
const queries = {
    verifyGoogleToken: async (parent: any, {token}: {token: string})=> {
        const baseUrl = "https://oauth2.googleapis.com/tokeninfo"
        const authURL = new URL(baseUrl)
        authURL.searchParams.set('id_token', token);
        
        const {data} = await axios.get<TokenData>(authURL.toString(),{
            responseType: "json"
        })

        console.log(data.email)
        const isUserExist = await  prismaClient.user.findUnique({where:{email: data.email},})
        // if(isUserExist) throw new Error("User already exists")
        if(!isUserExist && data.email){
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    fullname: data.given_name + " " + data.family_name,
                    profileImageUrl: data.picture,
                    username: "",
                }
            })
        }

        const user = await prismaClient.user.findUnique({where: {email: data.email}})
        if(!user) throw new Error("User not found")
        const tokenizedUser = await JWTservice.generateUserToken(user)

        return tokenizedUser;
    }
}

export const resolvers = {queries}