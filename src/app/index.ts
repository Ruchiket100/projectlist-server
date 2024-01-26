import { ApolloServer } from "@apollo/server";
import express from "express";
import {expressMiddleware} from "@apollo/server/express4";
import bodyParser, { json } from "body-parser";

export async function initServer(){
    const app = express()

    app.use(bodyParser.json());

    const graphqlServer = new ApolloServer({
        typeDefs:`
            type Query{
                message: String
            }
        `,
        resolvers:{
            Query:{
                message: ()=> "Hello There"
            }
        },  
    })
    await graphqlServer.start()
    
    app.use("/graphql", expressMiddleware(graphqlServer))

    return app;
} 
 

