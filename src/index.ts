import Koa from "koa";
import cors from "koa-cors";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

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


const app = new Koa();
const route = new Router();



route.post("/auth", async (ctx, next) => {

    const { email, password} = ctx.request.body as IAuthRouteLoginRequest;

    if(!email || !password){
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret1"
        }
        return;
    }

    const user = users.find((item) => item.email == email);

    if(!user){
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret2"
        }
        return;
    }

    const passwordMatch = await compare(password, user.password);
    
    if(!passwordMatch) {
        ctx.status = 401;
        ctx.body = {
            message: "Email or password incorret 3"
        }
        return;
    }
    
    const token = sign({}, "secret", {expiresIn: "1h"});

    ctx.status = 200;
    ctx.body = {
        token
    }

    
});

app.use(cors());
app.use(bodyParser());
app.use(route.routes());

app.listen(3000, () => {
    console.log("Server running at 3000 port!!");
});