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
            let query;
            let populate = '';
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    query = {
                        "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) }
                    };
                    populate = 'condition';
                    findDocuments(Company_1.default, query, "", {}, populate, '', 0, null, null).then((result) => {
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
                        message: "Error al traer cuentas",
                        success: false,
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
    async update(request, response, next, app) {
        try {
            const { id, name, email, phone } = request.body;
            let update = { name, email, phone };
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            findOneAndUpdateDB(Company_1.default, query, update, null, null).then((result) => {
                if (result) {
                    response.json({
                        message: 'Cuenta Actualizada correctamente',
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
    async deleteAccount(request, response, next, app) {
        try {
            const { id } = request.body;
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    let update = { 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                    findOneAndUpdateDB(Company_1.default, query, update, null, null).then((result) => {
                        if (result) {
                            response.json({
                                message: 'Usuario Actualizado correctamente',
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
            });
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
                        mensaje: 'Creacion de compañia exitosa',
                        data: result,
                        success: true
                    });
                }).catch((err) => {
                    response.json({
                        mensaje: err.message,
                        success: false
                    });
                });
            }
            else {
                response.json({
                    mensaje: "Error Al Crear Cuenta, no se encontro estado valido",
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
            mensaje: 'Listado de ordenes',
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
