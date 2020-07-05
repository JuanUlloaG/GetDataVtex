"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jwt = require('jsonwebtoken');
const { initDB, insertDB } = require("../config/db");
const User_1 = __importDefault(require("../entity/User"));
const data = require("../mock.json");
const dataB = require("../mockBag.json");
// const {bcrypt} = require("bcryptjs")
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        console.log(data);
        response.json({
            mensaje: 'Listado de ordenes',
            data: data,
            success: true
        });
    }
    async one(request, response, next, app) {
        return null;
    }
    async save(request, response, next, app) {
        try {
            const { name, phone, email, profile, rut, password } = request.body;
            let hashedPassword;
            if (!name || !phone || !email || !profile || !rut || !password) {
                response.json({
                    mensaje: 'Error! al crear usuario',
                    success: false
                });
            }
            bcryptjs_1.default.genSalt(10, function (err, salt) {
                bcryptjs_1.default.hash(password, salt, function (err, hash) {
                    hashedPassword = hash;
                    let _user = { name, rut, email, password: hashedPassword, phone, profile };
                    insertDB(User_1.default, _user).then((result) => {
                        response.json({
                            mensaje: 'Creacion de Usuario',
                            data: result,
                            success: true
                        });
                    }).catch((err) => {
                        console.log(err.message);
                    });
                });
            });
        }
        catch (error) {
            response.json({
                mensaje: 'Error! al crear usuario',
                info: error.message,
                success: false
            });
        }
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
        const payload = {
            check: true
        };
        let profile = 3;
        switch (request.body.usuario.charAt(0)) {
            case "1":
                profile = 2;
                break;
            case "2":
                profile = 3;
                break;
            case "3":
                profile = 4;
                break;
            default:
                break;
        }
        const token = jwt.sign(payload, app.get('key'), {});
        response.json({
            mensaje: 'Autentication successfull',
            token: token,
            profile: profile
        });
        // try {
        //   admin.auth().getUser(request.body.uid).then((result: any) => {
        //     response.json({
        //       mensaje: 'Autentication successfull',
        //       token: token,
        //       uid: result.uid
        //     });
        //   }).catch((err: any) => {
        //     response.json({ mensaje: "Ha ocurrido algun error: " + err.message })
        //   });
        // } catch (error) {
        //   response.json({ mensaje: "Ha ocurrido algun error: " + error.message })
        // }
    }
}
exports.UserController = UserController;
