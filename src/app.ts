import express from 'express';
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
import { Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
const validation = require("./middleware/middleware")
const { initDB, insertDB } = require("./config/db")

let app = express();
// 1
app.set('key', config.key);
// 2
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());

function checkUser(req: Request, res: Response, next: NextFunction) {
    if (req.path === "/users/auth" || req.path === "/users") {
        next();
    } else {
        const token = (<any>req).headers['access-token'];
        if (token) {
            jwt.verify(token, app.get('key'), (err: any, decoded: any) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválida' });
                } else {
                    (<any>req).decoded = decoded;
                    next();
                }
            });
        } else {
            res.send({
                mensaje: 'Token no proveída.'
            });
        }
    }
}


app.all("*", checkUser)

Routes.forEach(route => {
    (app as any)[route.method](route.route, (req: Request, res: Response, next: NextFunction) => {
        const result = (new (route.controller as any))[route.action](req, res, next, app);
        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.status(200).send(result) : undefined);

        } else if (result !== null && result !== undefined) {
            res.status(500).json(result);
        }
    });
});



initDB().then((result: any) => {
    //     console.log(result)
    app.listen(3000)
}).catch((err: Error) => {
    console.log(err.message)
});

