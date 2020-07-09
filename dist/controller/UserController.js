"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jwt = require('jsonwebtoken');
const mongoose_1 = __importDefault(require("mongoose"));
const { initDB, insertDB, findOneDB, findDocuments } = require("../config/db");
const User_1 = __importDefault(require("../entity/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        // console.log(data)
        response.json({
            mensaje: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async one(request, response, next, app) {
        return null;
    }
    async save(request, response, next, app) {
        try {
            const { name, phone, email, profile, rut, password, company } = request.body;
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
                    let _user;
                    if (company) {
                        _user = { name, rut, email, password: hashedPassword, phone, profile, company: mongoose_1.default.Types.ObjectId(company) };
                    }
                    else {
                        _user = { name, rut, email, password: hashedPassword, phone, profile };
                    }
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
        try {
            const query = { 'rut': request.body.user };
            const payload = {
                check: true
            };
            findDocuments(User_1.default, query, "", {}, '', '', 0, null, null).then((result) => {
                if (result.length > 0) {
                    let pass = result[0].password;
                    bcryptjs_1.default.compare(request.body.password, pass, (err, match) => {
                        if (err) {
                            response.json({
                                message: 'Error',
                                success: false,
                                code: err
                            });
                        }
                        if (match) {
                            const token = jwt.sign(payload, app.get('key'), {});
                            response.json({
                                message: 'Autentication successfull',
                                token: token,
                                profile: result[0].profile,
                                company: result[0].company,
                                name: result[0].name,
                                email: result[0].email,
                                id: result[0]._id,
                                success: true
                            });
                        }
                    });
                }
                else {
                    response.json({
                        message: 'Error usuario no encontrado',
                        success: false
                    });
                }
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
}
exports.UserController = UserController;
