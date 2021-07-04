import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Posts";
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolves/hello";

const main = async () => {
    const orm =  await MikroORM.init(microConfig);

    // run migration automatically
    await orm.getMigrator().up();

    const app = express();

    // create apollo server to create schema 
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            // add resolvers
            resolvers: [HelloResolver],
            validate: false
        })
    })

    // create graphql endpoint for apollo server 
    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main();


console.log('hell wrld')