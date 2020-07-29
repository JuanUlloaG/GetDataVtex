import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Shop from "../entity/Shop";
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
import State from "../entity/State";


export class ShopController {

    // private userRepository = getRepository(User);

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
                    populate = 'condition company'
                    findDocuments(Shop, query, "", {}, populate, '', 0, null, null).then((result: any) => {
                        response.json({
                            message: 'Listado de Tiendas',
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

    async localByUser(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const userCompany = request.body.userCompany
            let query = {};
            if (userCompany) {
                query = {
                    'company': userCompany
                }
            }

            const select = 'id_ address number'

            findDocuments(Shop, query, select, {}, '', '', 0, null, null).then((result: any) => {
                response.json({
                    message: 'Listado de locales para el usuario',
                    data: result,
                    success: true
                });
            }).catch((err: Error) => {
                response.json({
                    message: 'error listando locales para el usuario',
                    data: [],
                    err: [],
                    success: true
                });
                console.log("error", err)
            });

        } catch (error) {
            response.json({
                message: 'error listando locales para el usuario',
                data: [],
                eror: error,
                success: true
            });
        }

    }


    async shopUpdate(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { id, name, address, company } = request.body
            let update = { number: name, address, company: mongoose.Types.ObjectId(company) }
            let query: object;
            query = { '_id': mongoose.Types.ObjectId(id) }
            findOneAndUpdateDB(Shop, query, update, null, null).then((result: any) => {
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

    /*
      Metodo que recibe un array de ordenes para guardarlas en la base de datos
   */
    async save(request: Request, response: Response, next: NextFunction, app: any) {
        const { phone, address, company, name } = request.body

        let queryState = { "key": 9 }
        findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
            if (findResult.length > 0) {
                let stateId = findResult[0]._id;
                let shop = { phone, address, company: mongoose.Types.ObjectId(company), number: name, 'condition': mongoose.Types.ObjectId(stateId) }
                insertDB(Shop, shop).then((result: any) => {
                    response.json({
                        message: 'Local creado exitosamente',
                        data: result,
                        success: true
                    });
                }).catch((err: Error) => {
                    console.log(err.message)
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

    async remove(request: Request, response: Response, next: NextFunction, app: any) {

    }

    async auth(request: Request, response: Response, next: NextFunction, app: any) {
    }
}