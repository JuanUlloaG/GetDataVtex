"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const jwt = require('jsonwebtoken');
const mongoose_1 = __importDefault(require("mongoose"));
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
const User_1 = __importDefault(require("../entity/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const State_1 = __importDefault(require("../entity/State"));
mongoose_1.default.set('debug', true);
class UserController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        try {
            const { company, query } = request.body;
            let arrayQuery = [];
            let _query;
            let query_ = {};
            if (query) {
                if (query.profile) {
                    query_['profile'] = mongoose_1.default.Types.ObjectId(query.profile);
                }
                if (query.company) {
                    query_['company'] = mongoose_1.default.Types.ObjectId(query.company);
                }
            }
            let populate = '';
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (company) {
                        if (query) {
                            if (query.profile && query.company) {
                                query_['$and'] = [{ "company": mongoose_1.default.Types.ObjectId(company) }, { "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) } }];
                            }
                            else {
                                query_['$and'] = [{ "company": mongoose_1.default.Types.ObjectId(company) }, { "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) } }];
                            }
                        }
                        else {
                            query_ = {
                                "company": mongoose_1.default.Types.ObjectId(company),
                                "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) }
                            };
                        }
                    }
                    else {
                        if (query) {
                            query_['$and'] = [{ "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) } }];
                        }
                        else {
                            query_ = {
                                "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) }
                            };
                        }
                    }
                    populate = 'profile company condition';
                    findDocuments(User_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
                        response.json({
                            message: 'Listado de usuarios',
                            data: result,
                            success: true
                        });
                    }).catch((err) => {
                        response.json({
                            message: err,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: "Error al traer lista de usuaruios",
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err.message,
                    success: false
                });
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async deleteUser(request, response, next, app) {
        try {
            const { id } = request.body;
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    let update = { 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                    findOneAndUpdateDB(User_1.default, query, update, null, null).then((result) => {
                        if (result) {
                            response.json({
                                message: 'Usuario Actualizado correctamente',
                                data: result,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: "Error al actualizar usuario",
                                success: false
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
                        success: false
                    });
                }
            }).catch((err) => {
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async update(request, response, next, app) {
        try {
            const { id, name, email, phone, profile } = request.body;
            let update = { name, email, phone, profile };
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            findOneAndUpdateDB(User_1.default, query, update, null, null).then((result) => {
                if (result) {
                    response.json({
                        message: 'Usuario Actualizado correctamente',
                        data: result,
                        success: true
                    });
                }
                else {
                    response.json({
                        message: "Error al actualizar usuario",
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err,
                    success: false
                });
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async one(request, response, next, app) {
        return null;
    }
    async save(request, response, next, app) {
        try {
            const { name, phone, email, profile, rut, password, company } = request.body;
            if (!name || !phone || !email || !profile || !rut || !password) {
                response.json({
                    message: 'Error! al crear usuario',
                    success: false
                });
            }
            bcryptjs_1.default.genSalt(10, function (err, salt) {
                bcryptjs_1.default.hash(password, salt, function (err, hash) {
                    let hashedPassword;
                    hashedPassword = hash;
                    let queryState = { "key": 9 };
                    findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                        let _user = {};
                        if (findResult.length > 0) {
                            let stateId = findResult[0]._id;
                            _user = { name, rut, email, password: hashedPassword, phone, profile: mongoose_1.default.Types.ObjectId(profile), condition: mongoose_1.default.Types.ObjectId(stateId), state: false };
                            if (company) {
                                _user['company'] = mongoose_1.default.Types.ObjectId(company);
                            }
                            insertDB(User_1.default, _user).then((result) => {
                                response.json({
                                    message: 'Usuario ' + name + ' Creado exitosamente ',
                                    data: result,
                                    success: true
                                });
                            }).catch((err) => {
                                response.json({
                                    message: err.message,
                                    data: err,
                                    success: false
                                });
                                console.log(err);
                            });
                        }
                        else {
                            response.json({
                                message: 'Error Creacion de Usuario',
                                success: false
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err.message,
                            data: err,
                            success: false
                        });
                    });
                });
            });
        }
        catch (error) {
            response.json({
                message: 'Error! al crear usuario',
                info: error.message,
                success: false
            });
        }
    }
    async active(request, response, next, app) {
        const { id, state } = request.body;
        let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
        let update = { "state": state };
        findOneAndUpdateDB(User_1.default, query, update, null, null).then((update) => {
            if (update) {
                response.json({
                    message: 'Actualización de estado exitosa',
                    state: update.state,
                    success: true
                });
            }
            else {
                response.json({
                    message: "Error al actualizar estado",
                    success: false
                });
            }
        }).catch((err) => {
            response.json({
                message: err,
                success: false
            });
        });
    }
    async inactive(request, response, next, app) {
    }
    async auth(request, response, next, app) {
        try {
            const rut = request.body.user;
            const query = { 'rut': request.body.user };
            const payload = {
                check: true
            };
            const location = request.body.location;
            findDocuments(User_1.default, query, "", {}, 'company profile', '', 0, null, null).then((result) => {
                if (result.length > 0) {
                    // if ((result[0].profile.key == 2 || result[0].profile.key == 3) && location == 0) {
                    //   response.json({
                    //     message: 'Error, usuario no permitido',
                    //     success: false
                    //   });
                    // }
                    // if ((result[0].profile.key !== 2 && result[0].profile.key !== 3 && result[0].profile.key !== 4) && location == 1) {
                    //   response.json({
                    //     message: 'Error, usuario no permitido',
                    //     success: false
                    //   });
                    // }
                    let pass = result[0].password;
                    bcryptjs_1.default.compare(request.body.password, pass, (err, match) => {
                        if (err) {
                            response.json({
                                message: err,
                                success: false,
                                code: err
                            });
                        }
                        if (match) {
                            let query = { "_id": mongoose_1.default.Types.ObjectId(result[0]._id) };
                            let update = { "state": true };
                            findOneAndUpdateDB(User_1.default, query, update, null, null).then((update) => {
                                if (update) {
                                    const token = jwt.sign(payload, app.get('key'), {});
                                    let company = {};
                                    if (result[0].company) {
                                        company = { id: result[0].company._id, name: result[0].company.name };
                                    }
                                    else {
                                        company = { id: "", name: "N/A" };
                                    }
                                    response.json({
                                        message: 'Login exitoso',
                                        token: token,
                                        profile: result[0].profile,
                                        company: company,
                                        name: update.name,
                                        email: update.email,
                                        id: update._id,
                                        state: update.state,
                                        success: true
                                    });
                                }
                                else {
                                    response.json({
                                        message: "Ha ocurrido un error al iniciar sesión",
                                        success: false,
                                        data: update
                                    });
                                }
                            }).catch((err) => {
                                response.json({
                                    message: "error: " + err,
                                    success: false
                                });
                            });
                        }
                        else {
                            response.json({
                                message: "Error, Usuario o contraseña incorrecta",
                                success: false,
                                code: "err"
                            });
                        }
                    });
                }
                else {
                    response.json({
                        message: `Error, el usuario ${rut} no esta registrado`,
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err.message,
                    success: false
                });
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
