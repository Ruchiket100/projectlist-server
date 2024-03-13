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
exports.initServer = void 0;
const server_1 = require("@apollo/server");
const express_1 = __importDefault(require("express"));
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = require("./user");
const projects_1 = require("./projects");
const jwt_1 = __importDefault(require("../services/jwt"));
function initServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        app.use(body_parser_1.default.json());
        const graphqlServer = new server_1.ApolloServer({
            typeDefs: `
            ${user_1.User.types}
            ${projects_1.Projects.types}
            type Query{
                ${user_1.User.queries}
                ${projects_1.Projects.queries}
            }
            type Mutation{
                ${user_1.User.mutations}
                ${projects_1.Projects.mutations}
            }
        `,
            resolvers: Object.assign({ Query: Object.assign(Object.assign({}, user_1.User.resolvers.queries), projects_1.Projects.resolvers.queries), Mutation: Object.assign(Object.assign({}, user_1.User.resolvers.mutations), projects_1.Projects.resolvers.mutations) }, projects_1.Projects.resolvers.extraResolvers),
        });
        yield graphqlServer.start();
        app.use("/graphql", (0, express4_1.expressMiddleware)(graphqlServer, {
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const token = req.headers["authorization"];
                try {
                    const user = jwt_1.default.verifyToken(token);
                    return { user };
                }
                catch (error) {
                    return {};
                }
            })
        }));
        return app;
    });
}
exports.initServer = initServer;
