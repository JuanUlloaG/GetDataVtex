"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
const Shop_1 = __importDefault(require("../entity/Shop"));
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
const State_1 = __importDefault(require("../entity/State"));
class ShopController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        try {
            let { profile, company, query } = request.body;
            let _query;
            let populate = '';
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (query) {
                        if (query.company) {
                            _query = {
                                "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) },
                                "company": mongoose_1.default.Types.ObjectId(query.company)
                            };
                        }
                        if (query.number) {
                            _query = {
                                "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) },
                                "number": query.number
                            };
                        }
                        if (query.company && query.number) {
                            _query = {
                                "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) },
                                "$or": [{ "company": mongoose_1.default.Types.ObjectId(query.company) }, { "number": query.number }],
                            };
                        }
                    }
                    else {
                        _query = {
                            "condition": { "$ne": mongoose_1.default.Types.ObjectId(stateId) }
                        };
                    }
                    if (company) {
                        _query["company"] = { "$eq": mongoose_1.default.Types.ObjectId(company) };
                    }
                    populate = 'condition company';
                    findDocuments(Shop_1.default, _query, "", {}, populate, '', 0, null, null).then((result) => {
                        response.json({
                            message: 'Listado de Tiendas',
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
    async localByUser(request, response, next, app) {
        try {
            const userCompany = request.body.userCompany;
            let query = {};
            if (userCompany) {
                query = {
                    'company': userCompany
                };
            }
            const select = 'id_ address number';
            findDocuments(Shop_1.default, query, select, {}, '', '', 0, null, null).then((result) => {
                response.json({
                    message: 'Listado de locales para el usuario',
                    data: result,
                    success: true
                });
            }).catch((err) => {
                response.json({
                    message: 'error listando locales para el usuario',
                    data: [],
                    err: [],
                    success: true
                });
                console.log("error", err);
            });
        }
        catch (error) {
            response.json({
                message: 'error listando locales para el usuario',
                data: [],
                eror: error,
                success: true
            });
        }
    }
    async shopDelete(request, response, next, app) {
        try {
            const { id } = request.body;
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            let queryState = { "key": 10 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    let update = { 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                    findOneAndUpdateDB(Shop_1.default, query, update, null, null).then((result) => {
                        if (result) {
                            response.json({
                                message: 'TIenda Actualizada correctamente',
                                data: result,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: "Error al actualizar tienda",
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
                        message: "Error al eliminar las ordenes, no se ha encontrado un estado valido",
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
    async shopUpdate(request, response, next, app) {
        try {
            const { id, name, address, company } = request.body;
            let update = { number: name, address, company: mongoose_1.default.Types.ObjectId(company) };
            let query;
            query = { '_id': mongoose_1.default.Types.ObjectId(id) };
            findOneAndUpdateDB(Shop_1.default, query, update, null, null).then((result) => {
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
    /*
      Metodo que recibe un array de ordenes para guardarlas en la base de datos
   */
    async save(request, response, next, app) {
        const { phone, address, company, name } = request.body;
        let queryState = { "key": 9 };
        findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
            if (findResult.length > 0) {
                let stateId = findResult[0]._id;
                let shop = { phone, address, company: mongoose_1.default.Types.ObjectId(company), number: name, 'condition': mongoose_1.default.Types.ObjectId(stateId) };
                insertDB(Shop_1.default, shop).then((result) => {
                    response.json({
                        message: 'Local creado exitosamente',
                        data: result,
                        success: true
                    });
                }).catch((err) => {
                    console.log(err.message);
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
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
    }
}
exports.ShopController = ShopController;
