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
const db_1 = require("../clients/db");
const jwt_1 = __importDefault(require("../../services/jwt"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const queries = {
    sayHello(name) {
        return __awaiter(this, void 0, void 0, function* () { return `Hello, ${name}!`; });
    },
};
const mutations = {
    signup(_parent, { name, email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            // check is the email is unique
            const isExist = yield db_1.prismaClient.user.findUnique({
                where: { email: email }
            });
            //if not give me error and return error message
            if (isExist) {
                return {
                    success: false,
                    message: "user already exists"
                };
            }
            //else register the user and return the token
            const hashedPass = yield bcrypt_1.default.hash(password, 10);
            // generate unique username
            const key = crypto_1.default.randomBytes(32);
            const username = `PROJECT_LIST${key.toString('hex')}`;
            const newUser = yield db_1.prismaClient.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPass,
                    username: username
                }
            });
            const token = jwt_1.default.generateUserToken(newUser);
            return {
                token,
                success: true,
                message: 'user signed up successfully'
            };
        });
    },
    login(_parent, { email, username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if the user exists
            const isExsist = yield db_1.prismaClient.user.findUnique({ where: username ? { username: username } : { email: email } });
            //if not return error
            if (!isExsist)
                return {
                    success: false,
                    message: "user not found"
                };
            // check if the password is correct
            const isCorrect = yield bcrypt_1.default.compare(password, isExsist.password);
            //if not return error
            if (!isCorrect)
                return {
                    success: false,
                    message: "wrong password"
                };
            //else return the token
            return {
                token: jwt_1.default.generateUserToken(isExsist),
                success: true,
                message: "user logged in successfully"
            };
        });
    }
};
exports.resolvers = { queries, mutations };
