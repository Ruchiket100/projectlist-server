import { User } from "@prisma/client";
import JWT from 'jsonwebtoken'

const SecretKey = process.env.Secret_Key || "$secret@12u94u3#"

class JWTservice {
    public static generateUserToken(user:User){
        const payload ={
            id:user.id,
            email:user.email
        }

        const token = JWT.sign(payload, SecretKey)
        return token;
    }
}

export default JWTservice