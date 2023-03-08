import Koa from "koa";
import cors from "koa-cors";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";

const app = new Koa();

const route = new Router();

route.post("/user", (ctx, next) => {
    console.log(ctx.request.body);
    ctx.body = {
        status: 200
    }
});

app.use(cors());
app.use(bodyParser());
app.use(route.routes());


app.listen(3000, () => {
    console.log("Server running at 3000 port!!");
});