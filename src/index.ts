import express from 'express';
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
import { Request, Response, NextFunction } from "express";
import { Routes } from "./routes";
const validation = require("./middleware/middleware")
const { initDB, insertDB } = require("./config/db")
import user from './entity/User'

let app = express();
// 1
app.set('key', config.key);
// 2
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());

function checkUser(req: Request, res: Response, next: NextFunction) {
    if (req.path === "/users/auth") {
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

    let _user = { name: "carlos", rut: "26089182-0", password: "123456789" }
    insertDB(user, _user).then((result: any) => {

    }).catch((err: any) => {
        console.log(err.message)
    });
    app.listen(3001)
}).catch((err: Error) => {
    console.log(err.message)
});

