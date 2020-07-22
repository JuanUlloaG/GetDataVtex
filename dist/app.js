"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config/config');
const routes_1 = require("./routes");
const validation = require("./middleware/middleware");
const { initDB, insertDB } = require("./config/db");
let app = express_1.default();
// 1
app.set('key', config.key);
// 2
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());
function checkUser(req, res, next) {
    if (req.path === "/users/auth" || req.path === "/users" || req.path === "/company" || req.path === "/order/save" || req.path === "/shop/save" || req.path === "/") {
        next();
    }
    else {
        const token = req.headers['access-token'];
        if (token) {
            jwt.verify(token, app.get('key'), (err, decoded) => {
                if (err) {
                    return res.json({ mensaje: 'Token inválida' });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.send({
                mensaje: 'Token no proveída.'
            });
        }
    }
}
app.all("*", checkUser);
routes_1.Routes.forEach(route => {
    app[route.method](route.route, (req, res, next) => {
        const result = (new route.controller)[route.action](req, res, next, app);
        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? res.status(200).send(result) : undefined);
        }
        else if (result !== null && result !== undefined) {
            res.status(500).json(result);
        }
    });
});
initDB().then((result) => {
    app.listen(3001, () => {
        console.log(result);
        console.log("Picking server on! happy hacking 👨🏾‍💻");
    });
}).catch((err) => {
    console.log(err);
});
