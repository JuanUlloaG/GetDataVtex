import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import mongoose from "mongoose";
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
import State from "../entity/State";
import Company from "../entity/Company";

export class CompanyControllers {

    async all(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            let { profile, company, query } = request.body
            let _query: any = {};
            let populate: string = '';
            let queryState = { "key": 10 }
            findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (Object.keys(query).length > 0) {
                        if (query.rut) {
                            _query["condition"] = { "$ne": mongoose.Types.ObjectId(stateId) }
                            _query["rut"] = query.rut
                        }
                        if (query.name) {
                            _query["condition"] = { "$ne": mongoose.Types.ObjectId(stateId) }
                            _query["name"] = query.name
                        }

                    } else {
                        _query = {
                            "condition": { "$ne": mongoose.Types.ObjectId(stateId) }
                        }
                    }
                    populate = 'condition'
                    findDocuments(Company, _query, "", {}, populate, '', 0, null, null).then((result: Array<any>) => {
                        if (result.length > 0) {
                            response.json({
                                message: 'Listado de usuarios',
                                data: result,
                                success: true
                            });
                        } else {
                            response.json({
                                message: 'Listado de usuarios',
                                data: result,
                                success: true
                            });
                        }
                    }).catch((err: Error) => {
                        response.json({
                            message: err.message,
                            success: false,
                            data: []
                        });
                    });
                } else {
                    response.json({
                        message: "Error al traer cuentas",
                        success: false,
                        data: []
                    });
                }
            }).catch((err: Error) => {
                response.json({
                    message: err.message,
                    success: false,
                    data: []
                });
            });
        } catch (error) {
            response.json({
                message: error,
                success: false,
                data: []
            });
        }
    }

    async update(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { id, name, email, phone } = request.body
            let update = { name, email, phone }
            let query: object;
            query = { '_id': mongoose.Types.ObjectId(id) }
            findOneAndUpdateDB(Company, query, update, null, null).then((result: any) => {
                if (result) {
                    response.json({
                        message: 'Cuenta Actualizada correctamente',
                        data: result,
                        success: true
                    });
                } else {
                    response.json({
                        message: "Error al actualizar cuenta",
                        success: false,
                        data: result
                    });
                }

            }).catch((err: Error) => {
                response.json({
                    message: err,
                    success: false
                });
            });

        } catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }

    async deleteAccount(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { id } = request.body
            let query: object;
            query = { '_id': mongoose.Types.ObjectId(id) }
            let queryState = { "key": 10 }
            if (id) {
                findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
                    console.log("arer", findResult)
                    if (findResult.length > 0) {
                        let stateId = findResult[0]._id;
                        let update = { 'condition': mongoose.Types.ObjectId(stateId) }
                        findOneAndUpdateDB(Company, query, update, null, null).then((result: any) => {
                            if (result) {
                                response.json({
                                    message: 'Se ha eliminado la cuenta correctamente',
                                    data: result,
                                    success: true
                                });
                            } else {
                                response.json({
                                    message: "Error al eliminar cuenta",
                                    success: false
                                });
                            }

                        }).catch((err: Error) => {
                            response.json({
                                message: err,
                                success: false
                            });
                        });
                    } else {
                        response.json({
                            message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
                            success: false
                        });
                    }
                }).catch((err: Error) => {
                    response.json({
                        message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
                        success: false
                    });
                })
            } else {
                response.json({
                    message: "Error al eliminar la cuenta, el identificador es invalido",
                    success: false
                });
            }
        } catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }

    async save(request: Request, response: Response, next: NextFunction, app: any) {
        const { name, phone, email, rut } = request.body
        let queryState = { "key": 9 }
        findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
            if (findResult.length > 0) {
                let stateId = findResult[0]._id;
                let _company = { name, rut, email, phone, 'condition': mongoose.Types.ObjectId(stateId) }
                insertDB(Company, _company).then((result: any) => {
                    response.json({
                        message: 'Se ha creado la cuenta: ' + name,
                        data: result,
                        success: true
                    });
                }).catch((err: Error) => {
                    response.json({
                        message: err.message,
                        success: false
                    });
                });
            } else {
                response.json({
                    message: "Error Al Crear Cuenta, no se encontro estado valido",
                    success: false
                });
            }
        }).catch((err: Error) => {
            response.json({
                message: err,
                success: false
            });
        });
    }

    async ordersToDelivery(request: Request, response: Response, next: NextFunction, app: any) {
        response.json({
            message: 'Listado de ordenes',
            data: [],
            success: true
        });
    }

    async remove(request: Request, response: Response, next: NextFunction, app: any) {

    }

    async auth(request: Request, response: Response, next: NextFunction, app: any) {

    }
}