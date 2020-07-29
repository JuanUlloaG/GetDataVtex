import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import mongoose from "mongoose";
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
import State from "../entity/State";
import Company from "../entity/Company";

export class CompanyControllers {

    async all(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            let query: object;
            let populate: string = '';
            let queryState = { "key": 10 }
            findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    query = {
                        "condition": { "$ne": mongoose.Types.ObjectId(stateId) }
                    }
                    populate = 'condition'
                    findDocuments(Company, query, "", {}, populate, '', 0, null, null).then((result: any) => {
                        response.json({
                            message: 'Listado de usuarios',
                            data: result,
                            success: true
                        });
                    }).catch((err: Error) => {
                        response.json({
                            message: err,
                            success: false
                        });
                    });
                } else {
                    response.json({
                        message: "Error al traer cuentas",
                        success: false,
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
            findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    let update = { 'condition': mongoose.Types.ObjectId(stateId) }
                    findOneAndUpdateDB(Company, query, update, null, null).then((result: any) => {
                        if (result) {
                            response.json({
                                message: 'Usuario Actualizado correctamente',
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

            })
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
                        mensaje: 'Creacion de compañia exitosa',
                        data: result,
                        success: true
                    });
                }).catch((err: Error) => {
                    response.json({
                        mensaje: err.message,
                        success: false
                    });
                });
            } else {
                response.json({
                    mensaje: "Error Al Crear Cuenta, no se encontro estado valido",
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
            mensaje: 'Listado de ordenes',
            data: [],
            success: true
        });
    }

    async remove(request: Request, response: Response, next: NextFunction, app: any) {

    }

    async auth(request: Request, response: Response, next: NextFunction, app: any) {

    }
}