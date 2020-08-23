"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyControllers = void 0;
const jwt = require('jsonwebtoken');
const mongoose_1 = __importDefault(require("mongoose"));
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
const State_1 = __importDefault(require("../entity/State"));
const Company_1 = __importDefault(require("../entity/Company"));
class CompanyControllers {
    async all(request, response, next, app) {
        try {
            let { profile, company, query } = request.body;
            let _query = {};
            let populate = '';
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (Object.keys(query).length > 0) {
                        if (query.rut) {
                            _query["condition"] = { "$ne": mongoose_1.default.Types.ObjectId(stateId) };
                            _query["rut"] = query.rut;
                        }
                        if (query.name) {
                            _query["condition"] = { "$ne": mongoose_1.default.Types.ObjectId(stateId) };
                            _query["name"] = query.name;
                        }
                    }
                    else {
                        _query = {
                            "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) }
                        };
                    }
                    populate = 'condition';
                    findDocuments(Company_1.default, _query, "", {}, populate, '', 0, null, null).then((result) => {
                        if (result.length > 0) {
                            response.json({
                                message: 'Listado de usuarios',
                                data: result,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: 'Listado de usuarios',
                                data: result,
                                success: true
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err.message,
                            success: false,
                            data: []
                        });
                    });
                }
                else {
                    response.json({
                        message: "Error al traer cuentas",
                        success: false,
                        data: []
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err.message,
                    success: false,
                    data: []
                });
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false,
                data: []
            });
        }
    }
    async update(request, response, next, app) {
        try {
            const { id, name, email, phone, rut } = request.body;
            if (id) {
                if (name !== "" && email !== "" && phone !== "" && rut !== "") {
                    let update = { name, email, phone, rut };
                    let query;
                    query = { '_id': mongoose_1.default.Types.ObjectId(id) };
                    findOneAndUpdateDB(Company_1.default, query, update, null, null).then((result) => {
                        if (result) {
                            console.log(result);
                            response.json({
                                message: `Cuenta ${result.name} actualizada correctamente`,
                                data: result,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: "Error al actualizar cuenta",
                                success: false,
                                data: result
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err.message,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: "Error al actualizar cuenta, no puedes dejar en blanco la informacion de la cuenta",
                        success: false,
                        data: []
                    });
                }
            }
            else {
                response.json({
                    message: "Error al actualizar cuenta, el dentificador de la cuenta es erroneo",
                    success: false,
                    data: []
                });
            }
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async deleteAccount(request, response, next, app) {
        try {
            const { id } = request.body;
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            let queryState = { "key": 10 };
            if (id) {
                findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                    console.log("arer", findResult);
                    if (findResult.length > 0) {
                        let stateId = findResult[0]._id;
                        let update = { 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                        findOneAndUpdateDB(Company_1.default, query, update, null, null).then((result) => {
                            if (result) {
                                response.json({
                                    message: 'Se ha eliminado la cuenta correctamente',
                                    data: result,
                                    success: true
                                });
                            }
                            else {
                                response.json({
                                    message: "Error al eliminar cuenta",
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
                    response.json({
                        message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
                        success: false
                    });
                });
            }
            else {
                response.json({
                    message: "Error al eliminar la cuenta, el identificador es invalido",
                    success: false
                });
            }
        }
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async save(request, response, next, app) {
        const { name, phone, email, rut } = request.body;
        let queryState = { "key": 9 };
        findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
            if (findResult.length > 0) {
                let stateId = findResult[0]._id;
                let _company = { name, rut, email, phone, 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                insertDB(Company_1.default, _company).then((result) => {
                    response.json({
                        message: 'Se ha creado la cuenta: ' + name,
                        data: result,
                        success: true
                    });
                }).catch((err) => {
                    response.json({
                        message: err.message,
                        success: false
                    });
                });
            }
            else {
                response.json({
                    message: "Error Al Crear Cuenta, no se encontro estado valido",
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
    async ordersToDelivery(request, response, next, app) {
        response.json({
            message: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
    }
}
exports.CompanyControllers = CompanyControllers;
