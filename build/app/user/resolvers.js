"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../clients/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const queries = {
    verifyGoogleToken: (parent, { token }) => __awaiter(void 0, void 0, void 0, function* () {
        const baseUrl = "https://oauth2.googleapis.com/tokeninfo";
        const authURL = new URL(baseUrl);
        authURL.searchParams.set('id_token', token);
        const { data } = yield axios_1.default.get(authURL.toString(), {
            responseType: "json"
        });
        console.log(data.email);
        const isUserExist = yield db_1.prismaClient.user.findUnique({ where: { email: data.email }, });
        // if(isUserExist) throw new Error("User already exists")
        if (!isUserExist && data.email) {
            yield db_1.prismaClient.user.create({
                data: {
                    email: data.email,
                    fullname: data.given_name + " " + data.family_name,
                    profileImageUrl: data.picture,
                    username: "",
                }
            });
        }
        const user = yield db_1.prismaClient.user.findUnique({ where: { email: data.email } });
        if (!user)
            throw new Error("User not found");
        const tokenizedUser = yield jwt_1.default.generateUserToken(user);
        return tokenizedUser;
    })
};
exports.resolvers = { queries };
