import Koa from "koa";
import cors from "koa-cors";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";

import { compare } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

interface IAuthRouteLoginRequest {
    email: string;
    password: string;
}

const users = [
    {
        email: "joao@gmail.com",
        password: "$2b$10$hTzeoNarCTqc8zfPDZa5fO54OLhASLpNbl8tKbqTrQIdgab3S09IW",
    }
];

const books = [
    {
        name: "JS",
        description: "Lorem ipsum"
    }
]

const app = new Koa();
const route = new Router();

const verifyToken = (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
    console.log(ctx);

    const authToken = ctx.request.header.authorization;

    const [, token] = authToken.split(" ");

    if(!token){
        ctx.status = 401;
        ctx.body = {
            message: "Unauthorized"
        };
        return;
    }

    try {
        verify(token, "secret");
        return next();
    } catch(error) {
        ctx.status = 401;
        ctx.body = {
            message: "Unauthorized"
        };
        console.log(error);
        return;
    }

}

route.use("/books", verifyToken);

route.post("/auth", async (ctx, next) => {

    const { email, password} = ctx.request.body as IAuthRouteLoginRequest;

    if(!email || !password){
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret"
        }
        return;
    }

    const user = users.find((item) => item.email == email);

    if(!user){
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret"
        }
        return;
    }

    const passwordMatch = await compare(password, user.password);
    
    if(!passwordMatch) {
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret"
        }
        return;
    }
    
    const token = sign({}, "secret", {expiresIn: "1h"});

    ctx.status = 200;
    ctx.body = {
        token
    }

    return;
});

route.get("/books", async (ctx, next) => {
    ctx.body = {
        books
    };

    return;
})

app.use(logger());
app.use(cors());
app.use(bodyParser());
app.use(route.routes());

app.listen(3000, () => {
    console.log("Server running at 3000 port!!");
});