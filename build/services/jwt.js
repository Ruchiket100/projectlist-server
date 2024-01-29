"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SecretKey = process.env.Secret_Key || "$secret@12u94u3#";
class JWTservice {
    static generateUserToken(user) {
        const payload = {
            id: user.id,
            email: user.email
        };
        const token = jsonwebtoken_1.default.sign(payload, SecretKey);
        return token;
    }
}
exports.default = JWTservice;
