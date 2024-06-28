import { ApolloServer } from "@apollo/server";
import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { User } from "./user";
import { Projects } from "./projects"
import JWTservice from "../services/jwt";

export async function initServer() {
    const app = express()

    app.use(bodyParser.json());


    const graphqlServer = new ApolloServer({
        typeDefs: `
            ${User.types}
            ${Projects.types}
            type Query{
                ${User.queries}
                ${Projects.queries}
            }
            type Mutation{
                ${User.mutations}
                ${Projects.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Projects.resolvers.queries
            },
            Mutation: {
                ...User.resolvers.mutations,
                ...Projects.resolvers.mutations
            },
            ...Projects.resolvers.extraResolvers
        },
    })
    await graphqlServer.start()

    app.use("/graphql", expressMiddleware(graphqlServer, {
        context: async ({ req }) => {
            const token = req.headers["authorization"];
            try {
                const user = JWTservice.verifyToken(token as string);
                return { user };
            } catch (error) {
                return {};
            }
        }
    }))

    return app;
}


