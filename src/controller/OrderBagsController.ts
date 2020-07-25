import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import OrderBags from "../entity/OrderBags";
import Orders from "../entity/Orders";
import BagNumber from "../entity/Bagnumber";
import State from "../entity/State";
import { schemaBags } from "../entity/OrderBags";
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db")
import Ajv from 'ajv';
import { ObjectId } from "mongodb";
var ajv = new Ajv({ allErrors: true });

var validate = ajv.compile(schemaBags)

export class OrderBagsController {

    // private userRepository = getRepository(User);

    async index(request: Request, response: Response, next: NextFunction, app: any) {

    }


    async listAllBags(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { number } = request.body
            let query: object;
            query = {
                "bags.bagNumber": number,
                // "deliveryId": mongoose.Types.ObjectId(deliveryId),
                // "delivery": false
            }
            // if (shopId) {
            findDocuments(OrderBags, query, "", {}, 'orderNumber pickerId deliveryId', '', 0, null, null).then((result: any) => {
                if (result.length > 0) {
                    response.json({
                        message: 'Detalle de consulta',
                        data: result[0],
                        success: true
                    });
                } else {
                    response.json({
                        message: 'Detalle de consulta: No se encontraron ordenes asociadas',
                        data: {},
                        success: true
                    });
                }

            }).catch((err: Error) => {
                response.json({
                    message: err,
                    success: false
                });
            });
            // } else {
            //     response.json({
            //         message: "Listado de bolsas necesita una tienda (Shop ID)",
            //         success: false
            //     });
            // }
        } catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }


    async getNumber(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            findDocuments(BagNumber, {}, "", {}, '', '', 0, null, null).then((result: any) => {

                console.log(result.length)
                if (result.length) {
                    console.log("dsd", result[0].number)
                    let query = { "_id": mongoose.Types.ObjectId(result[0]._id) }
                    let update = { "number": result[0].number + 1 }
                    console.log(result[0].number + 1)
                    // findOneAndUpdateDB(OrderBags, query, update, null, null).then((update: any) => {
                    //     if (update) {
                    //         response.json({
                    //             message: 'Orden actualizada exitosamente',
                    //             data: update,
                    //             success: true
                    //         });
                    //     } else {
                    //         response.json({
                    //             message: "Error al actualizar Bulto",
                    //             success: false
                    //         });
                    //     }
                    // }).catch((err: Error) => {
                    //     response.json({
                    //         message: err,
                    //         success: false
                    //     });
                    // });
                } else {
                    insertDB(BagNumber, { number: '000000001' }).then((result: any) => {
                        response.json({
                            message: 'Number',
                            data: result,
                            success: true
                        });
                    }).catch((err: Error) => {
                        response.json({
                            message: err,
                            success: false
                        });
                    });
                }



            }).catch((err: Error) => {
                response.json({
                    message: err,
                    success: false
                });
            });
        } catch (error) {

        }
    }

    async listBags(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { shopId, deliveryId } = request.body
            let query: object;
            query = {
                "shopId": mongoose.Types.ObjectId(shopId),
                "deliveryId": mongoose.Types.ObjectId(deliveryId),
                "delivery": false
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

    async listBagsforTake(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { shopId } = request.body
            let query: object;
            query = {
                "shopId": shopId,
                "deliveryId": null
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
            let queryState = { "key": 4 }
            findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { id, deliveryId, orderId } = request.body
                    let query = { "_id": mongoose.Types.ObjectId(id) }
                    let queryOrder = { "_id": mongoose.Types.ObjectId(orderId) }
                    let updateOrder = { state: mongoose.Types.ObjectId(stateId), starDeliveryDate: new Date() }
                    let updateBag = { "deliveryId": mongoose.Types.ObjectId(deliveryId), "readyforDelivery": true }
                    if (id && deliveryId) {
                        findOneAndUpdateDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: any) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags, query, updateBag, null, null).then((update: any) => {
                                    console.log(update)
                                    if (update) {
                                        response.json({
                                            message: 'Orden actualizada exitosamente',
                                            data: update,
                                            success: true
                                        });
                                    } else {
                                        response.json({
                                            message: "Error al actualizar Bulto: " + update,
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
                                    message: "Error al actualizar Bulto: " + updateOrder,
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
                } else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
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


    async updateBagReceived(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            let query = { "key": 5 }
            findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { id, comment, received, orderId } = request.body
                    if (id) {
                        let queryOrder = { "_id": mongoose.Types.ObjectId(orderId) }
                        let updateOrder = { state: mongoose.Types.ObjectId(stateId), endDeliveryDate: new Date() }
                        let query = { "_id": mongoose.Types.ObjectId(id) }
                        let update = { "comment": comment, "delivery": true, "received": received }

                        findOneAndUpdateDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: any) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags, query, update, null, null).then((update: any) => {
                                    if (update) {
                                        response.json({
                                            message: 'Orden Actualizada correctamente',
                                            data: update,
                                            success: true
                                        });
                                    } else {
                                        console.log(update)
                                        response.json({
                                            message: "Error al actualizar Bulto",
                                            success: false
                                        });
                                    }
                                }).catch((err: Error) => {
                                    console.log(err)
                                    response.json({
                                        message: err,
                                        success: false
                                    });
                                });
                            } else {
                                response.json({
                                    message: "Error al actualizar Bulto: " + updateOrder,
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
                } else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
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
            let query = { "key": 3 }
            findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { orderNumber, bags, shopId, pickerId } = request.body
                    let bag = { orderNumber, bags, shopId, pickerId }
                    let valid = validate(bag)
                    if (valid) {
                        bag.orderNumber = mongoose.Types.ObjectId(orderNumber)
                        bag.shopId = mongoose.Types.ObjectId(shopId)
                        bag.pickerId = mongoose.Types.ObjectId(pickerId)

                        let query = { "_id": mongoose.Types.ObjectId(orderNumber) }
                        let queryFind = { "orderNumber": mongoose.Types.ObjectId(orderNumber) }
                        let update = { "pickerId": mongoose.Types.ObjectId(pickerId), bag: mongoose.Types.ObjectId(pickerId), "state": mongoose.Types.ObjectId(stateId), endPickingDate: new Date() }
                        findDocuments(OrderBags, queryFind, "", {}, '', '', 0, null, null).then((findResult: any) => {
                            if (!findResult.length) {
                                insertDB(OrderBags, bag).then((result: any) => {
                                    if (result) {
                                        update['bag'] = mongoose.Types.ObjectId(result._id)
                                        findOneAndUpdateDB(Orders, query, update, null, null).then((update: any) => {
                                            response.json({
                                                message: 'Orden guardada exitosamente',
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
                                            message: "Ha ocurrido un error al actualizar la orden",
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
                } else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
                    });
                }

            }).catch((err: Error) => {
                response.json({
                    message: err,
                    success: false
                });
            });

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