import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const main = async () => {
    const orm =  await MikroORM.init(microConfig);

    // run migration automatically
    await orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                 client: redisClient,
                 disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__ //cookie only works in https
            },
            saveUninitialized: false, 
            secret: 'testrandstring',
            resave: false,
        })
    )

    // create apollo server to create schema 
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            // add resolvers
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        // context is obj that accessible to all resolvers
        context: ({req, res}) => ({ em: orm.em, req, res })
    })

    // create graphql endpoint for apollo server 
    apolloServer.applyMiddleware({ app })

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
};

main();


console.log('hell wrld')