import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { User } from "./entities/User";

export default  {
    migrations: {
        path: path.join(__dirname, './migrations'), // path to the folder with migrations
        pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
    },
    entities: [Post, User],    
    dbName: "lireddit_server",
    user: "yunitjung",
    password: "letmein!",
    host: "127.0.0.1",
    type: "postgresql",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];
