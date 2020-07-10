import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import OrderBags from "../entity/OrderBags";
import Orders from "../entity/Orders";
import { schemaBags } from "../entity/OrderBags";
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db")
import Ajv from 'ajv';
var ajv = new Ajv({ allErrors: true });

var validate = ajv.compile(schemaBags)

export class OrderBagsController {

    // private userRepository = getRepository(User);

    async index(request: Request, response: Response, next: NextFunction, app: any) {

    }

    async listBags(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { shopId } = request.body
            let query: object;
            query = {
                "shopId": shopId
            }
            if (shopId) {
                findDocuments(OrderBags, query, "", {}, 'orderNumber', 'client orderNumber', 0, null, null).then((result: any) => {
                    response.json({
                        message: 'Listado de bolsas a despachar',
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
                    message: "Listado de bolsas necesita una tienda (Shop ID)",
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

    async updateBag(request: Request, response: Response, next: NextFunction, app: any) {

        try {
            const { id, deliveryId } = request.body
            let query = { "_id": mongoose.Types.ObjectId(id) }
            let update = { "devliveryId": mongoose.Types.ObjectId(deliveryId), "readyforDelivery": true }
            if (id && deliveryId) {
                findOneAndUpdateDB(OrderBags, query, update, null, null).then((update: any) => {
                    if (update) {
                        response.json({
                            message: 'Bulto actualizado exitosamente',
                            data: update,
                            success: true
                        });
                    } else {
                        response.json({
                            message: "Error al actualizar Bulto",
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
                    message: "Parametros Faltantes",
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

    async updateBagReceived(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            console.log("id")
            const { id, comment, received } = request.body
            if (id) {
                let query = { "_id": mongoose.Types.ObjectId(id) }
                let update = { "comment": comment, "delivery": true, "received": received }
                findOneAndUpdateDB(OrderBags, query, update, null, null).then((update: any) => {
                    if (update) {
                        response.json({
                            message: 'Bulto actualizado exitosamente',
                            data: update,
                            success: true
                        });
                    } else {
                        response.json({
                            message: "Error al actualizar Bulto",
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
                    message: "Debe proporcionar el id del bulto",
                    success: false
                });
            }
        } catch (error) {
            response.json({
                message: error.message,
                success: false
            });
        }
    }

    /*
      Metodo que recibe un array de bolsas para guardarlas en la base de datos
   */
    async save(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { orderNumber, bags, shopId, pickerId } = request.body
            let bag = { orderNumber, bags, shopId, pickerId }
            let valid = validate(bag)
            if (valid) {
                bag.orderNumber = mongoose.Types.ObjectId(orderNumber)
                bag.shopId = mongoose.Types.ObjectId(shopId)
                bag.pickerId = mongoose.Types.ObjectId(pickerId)

                let query = { "_id": mongoose.Types.ObjectId(orderNumber) }
                let queryFind = { "orderNumber": mongoose.Types.ObjectId(orderNumber) }
                let update = { "pickerId": mongoose.Types.ObjectId(pickerId) }
                findDocuments(OrderBags, queryFind, "", {}, '', '', 0, null, null).then((findResult: any) => {
                    if (!findResult.length) {
                        findOneAndUpdateDB(Orders, query, update, null, null).then((update: any) => {
                            insertDB(OrderBags, bag).then((result: any) => {
                                response.json({
                                    message: 'Bulto(s) guardado(s) exitosamente',
                                    data: result,
                                    success: true
                                });
                            }).catch((err: Error) => {
                                response.json({
                                    message: err,
                                    success: false
                                });
                            });
                        }).catch((err: Error) => {
                            response.json({
                                message: err,
                                success: false
                            });
                        });
                    } else {
                        response.json({
                            message: "No se puede agregar bolsa, orden ya tiene bulto(s) asignado(s)",
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
                    message: ajv.errorsText(validate.errors),
                    success: false
                });
            }
        } catch (error) {
            console.log(error)
            response.json({
                message: error.message,
                success: false
            });
        }
    }

    async remove(request: Request, response: Response, next: NextFunction, app: any) {
    }

    async auth(request: Request, response: Response, next: NextFunction, app: any) {
    }
}