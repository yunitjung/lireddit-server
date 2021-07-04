import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
    @Query(() => String)
    hello(){
        return "this return hello value"
    }
}