import { User } from "@prisma/client";
import JWT from 'jsonwebtoken'

const SecretKey = process.env.Secret_Key

class JWTservice {
    public static generateUserToken(user: User) {
        const payload = {
            id: user.id,
            email: user.email
        }
        if (SecretKey) {
            const token = JWT.sign(payload, SecretKey, { expiresIn: '3650d' })
            return token;
        }
        return { error: { message: "no secret key" } }
    }

    public static verifyToken(token: string) {
        if (SecretKey) {
            return JWT.verify(token, SecretKey)
        }
        return { error: { message: "Failed to Authorized Token"}}
    }
}

export default JWTservice