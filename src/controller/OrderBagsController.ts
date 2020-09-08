import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import OrderBags, { OrderBagsInterface } from "../entity/OrderBags";
import Orders, { OrderInterface } from "../entity/Orders";
import BagNumber from "../entity/Bagnumber";
import State, { StateInterface } from "../entity/State";
import { schemaBags } from "../entity/OrderBags";
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB, executeProcedure, findOneDB } = require("../config/db")
import Ajv from 'ajv';
import { ObjectId } from "mongodb";
import History, { HistoryInterface } from "../entity/History";
var ajv = new Ajv({ allErrors: true });


var validate = ajv.compile(schemaBags)

export class OrderBagsController {

    async index(request: Request, response: Response, next: NextFunction, app: any) {
    }

    async listAllBags(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const { number } = request.body
            let query: object;
            query = {
                "bags.bagNumber": number,
            }
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
            let query: any = {};
            query = {
                "shopId": mongoose.Types.ObjectId(shopId),
                "deliveryId": mongoose.Types.ObjectId(deliveryId),
                "delivery": false
            }

            let queryState = {
                "key": { '$in': ["8", "7", "6"] }
            }
            if (shopId) {
                findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
                    if (findResultState.length > 0) {
                        let stateIds: Array<any> = []
                        findResultState.map((state) => { stateIds.push(state._id) })
                        findDocuments(OrderBags, query, "", {}, 'orderNumber', '', 0, null, null).then((result: Array<any>) => {
                            let bagsResult = result.filter((bag) => !stateIds.includes(bag.orderNumber.state))
                            response.json({
                                message: 'Listado de bolsas a despachar',
                                data: bagsResult,
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
                            message: "Error al consultar estados, ",
                            success: false
                        });
                    }
                }).catch((err: Error) => {
                    response.json({
                        message: err,
                        success: false
                    });
                })
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
                    let updateOrder = { state: mongoose.Types.ObjectId(stateId), "deliveryId": mongoose.Types.ObjectId(deliveryId), starDeliveryDate: new Date() }
                    let updateBag = { "deliveryId": mongoose.Types.ObjectId(deliveryId), "readyforDelivery": true }
                    if (id && deliveryId) {
                        findOneAndUpdateDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: OrderInterface) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags, query, updateBag, null, null).then((update: OrderBagsInterface) => {
                                    if (update) {
                                        let historyObj = {
                                            state: mongoose.Types.ObjectId(stateId),
                                            orderNumber: updateOrder.orderNumber,
                                            order: mongoose.Types.ObjectId(updateOrder._id),
                                            bag: mongoose.Types.ObjectId(id),
                                            shop: mongoose.Types.ObjectId(updateOrder.shopId),
                                            picker: mongoose.Types.ObjectId(updateOrder.pickerId),
                                            delivery: mongoose.Types.ObjectId(deliveryId),
                                            orderSnapShot: updateOrder,
                                            dateHistory: new Date()
                                        }
                                        insertDB(History, historyObj).then((result: HistoryInterface) => {
                                            if (result) {
                                                response.json({
                                                    message: 'Orden Actualizada correctamente',
                                                    data: update,
                                                    success: true
                                                });
                                            } else {
                                                response.json({
                                                    message: 'Error al actualizar la orden',
                                                    data: result,
                                                    success: true
                                                });
                                            }
                                        }).catch((err: Error) => {
                                            response.json({
                                                message: err.message,
                                                success: false
                                            });
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

    //metodo donde se finaliza el despacho de la orden  
    async updateBagReceived(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            let query = { "key": 5 }
            findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<StateInterface>) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let stateDesc = findResultState[0].desc;
                    const { id, comment, received, orderId } = request.body
                    if (id) {
                        let queryOrder = { "_id": mongoose.Types.ObjectId(orderId) }
                        let updateOrder = { state: mongoose.Types.ObjectId(stateId), endDeliveryDate: new Date(), received: received, comment: comment }
                        let query = { "_id": mongoose.Types.ObjectId(id) }
                        let update = { comment: comment, "delivery": true, received: received }
                        findOneAndUpdateDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: OrderInterface) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags, query, update, null, null).then((update: OrderBagsInterface) => {
                                    if (update) {
                                        findOneDB(Orders, orderId, "", {}, '', '', 0, null, null).then((OrderResult: OrderInterface) => {
                                            if (OrderResult) {
                                                let historyObj = {
                                                    state: mongoose.Types.ObjectId(stateId),
                                                    orderNumber: updateOrder.orderNumber,
                                                    order: mongoose.Types.ObjectId(OrderResult._id),
                                                    bag: mongoose.Types.ObjectId(id),
                                                    shop: mongoose.Types.ObjectId(OrderResult.shopId),
                                                    picker: mongoose.Types.ObjectId(OrderResult.pickerId),
                                                    delivery: mongoose.Types.ObjectId(OrderResult.deliveryId),
                                                    orderSnapShot: Object.assign({}, OrderResult.toJSON()),
                                                    dateHistory: new Date()
                                                }
                                                let param: object = {
                                                    "CuentaCliente": OrderResult.uid.name,
                                                    "OrderTrabajo": OrderResult.orderNumber,
                                                    "FechaEntregaReal": OrderResult.endDeliveryDate ? new Date(OrderResult.endDeliveryDate) : null,
                                                    "RUT_Delivery": OrderResult.pickerId.rut,
                                                    "Nombre_Delivery": OrderResult.pickerId.name,
                                                    "Apellido_Delivery": OrderResult.pickerId.lastname,
                                                    "FechaRecepcionDelivery": null,
                                                    "Estado": stateDesc,
                                                }
                                                insertDB(History, historyObj).then((result: HistoryInterface) => {
                                                    if (result) {
                                                        executeProcedure("[OMS].[Delivery]", param).then((result: any) => {
                                                            if (result) {
                                                                response.json({
                                                                    message: 'Orden Actualizada correctamente',
                                                                    data: update,
                                                                    success: true
                                                                });
                                                            } else {
                                                                response.json({ message: "Error al ingresar las ordenes, Ha ocurrido algun error", success: false });
                                                            }
                                                        }).catch((err: any) => {
                                                            response.json({ message: err, success: false });
                                                        });



                                                    } else {
                                                        response.json({
                                                            message: 'Error al actualizar la orden',
                                                            data: result,
                                                            success: true
                                                        });
                                                    }
                                                }).catch((err: Error) => {
                                                    response.json({
                                                        message: err.message,
                                                        success: false
                                                    });
                                                });
                                            } else {
                                                response.json({
                                                    message: 'Error al actualizar la orden',
                                                    success: true
                                                });
                                            }
                                        }).catch((err: Error) => {
                                            response.json({
                                                message: err.message,
                                                success: false
                                            });
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
            findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<StateInterface>) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let stateDesc = findResultState[0].desc;
                    const { orderNumber, bags, shopId, pickerId } = request.body
                    let bag = { orderNumber, bags, shopId, pickerId }
                    let valid = validate(bag)
                    let unitsPicked = 0
                    let unitsReplaced = 0
                    let unitsBroken = 0
                    if (valid) {
                        bags.map((row: any) => {
                            row.products.map((bag: any) => {
                                unitsPicked = bag.unitsPicked + unitsPicked
                                unitsReplaced = bag.unitsReplaced + unitsReplaced
                                unitsBroken = bag.unitsBroken + unitsBroken
                            })
                        })
                        bag.orderNumber = mongoose.Types.ObjectId(orderNumber)
                        bag.shopId = mongoose.Types.ObjectId(shopId)
                        bag.pickerId = mongoose.Types.ObjectId(pickerId)

                        let query = { "_id": mongoose.Types.ObjectId(orderNumber) }
                        let queryFind = { "orderNumber": mongoose.Types.ObjectId(orderNumber) }
                        let update = {
                            "pickerId": mongoose.Types.ObjectId(pickerId),
                            bag: mongoose.Types.ObjectId(pickerId),
                            shopId: mongoose.Types.ObjectId(shopId),
                            "state": mongoose.Types.ObjectId(stateId),
                            endPickingDate: new Date()
                        }

                        findDocuments(OrderBags, queryFind, "", {}, '', '', 0, null, null).then((findResult: Array<OrderBagsInterface>) => {
                            if (!findResult.length) {
                                insertDB(OrderBags, bag).then((result: OrderBagsInterface) => {
                                    if (result) {
                                        update['bag'] = mongoose.Types.ObjectId(result._id)
                                        findOneAndUpdateDB(Orders, query, update, null, null).then((update: OrderInterface) => {
                                            if (update) {
                                                findOneDB(Orders, orderNumber, "", {}, '', '', 0, null, null).then((OrderResult: OrderInterface) => {
                                                    if (OrderResult) {
                                                        let historyObj = {
                                                            state: mongoose.Types.ObjectId(stateId),
                                                            orderNumber: update.orderNumber,
                                                            order: mongoose.Types.ObjectId(update._id),
                                                            bag: mongoose.Types.ObjectId(OrderResult.bag._id),
                                                            shop: mongoose.Types.ObjectId(shopId),
                                                            picker: mongoose.Types.ObjectId(pickerId),
                                                            delivery: null,
                                                            orderSnapShot: Object.assign({}, OrderResult.toJSON()),
                                                            dateHistory: new Date()
                                                        }
                                                        let param: object = {
                                                            "CuentaCliente": OrderResult.uid.name,
                                                            "OrderTrabajo": OrderResult.orderNumber,
                                                            "RUT_Picker": OrderResult.pickerId.rut,
                                                            "Nombre_Picker": OrderResult.pickerId.name,
                                                            "Apellido_Picker": OrderResult.pickerId.lastname,
                                                            "InicioPicking": OrderResult.startPickingDate ? new Date(OrderResult.startPickingDate) : null,
                                                            "FinPicking": OrderResult.endPickingDate ? new Date(OrderResult.endPickingDate) : null,
                                                            "UnPickeadasSolicitadas": unitsPicked,
                                                            "UnQuebradas": unitsBroken,
                                                            "UnidadesSustituidas": unitsReplaced,
                                                            "Estado": stateDesc,
                                                        }
                                                        insertDB(History, historyObj).then((result: HistoryInterface) => {
                                                            if (result) {
                                                                executeProcedure("[OMS].[PickingTerminado]", param).then((result: any) => {
                                                                    if (result) {
                                                                        response.json({
                                                                            message: 'Orden guardada exitosamente',
                                                                            data: result,
                                                                            success: true
                                                                        });
                                                                    } else {
                                                                        response.json({ message: "Error al ingresar las ordenes, Ha ocurrido algun error", success: false });
                                                                    }
                                                                }).catch((err: any) => {
                                                                    response.json({ message: err, success: false });
                                                                });
                                                            } else {
                                                                response.json({
                                                                    message: 'Error al Tomar la orden',
                                                                    data: result,
                                                                    success: true
                                                                });
                                                            }
                                                        }).catch((err: Error) => {
                                                            response.json({
                                                                message: err.message,
                                                                success: false
                                                            });
                                                        });
                                                    } else {
                                                        response.json({
                                                            message: 'Error al Tomar la orden',
                                                            data: result,
                                                            success: true
                                                        });
                                                    }
                                                }).catch((err: Error) => {
                                                    response.json({
                                                        message: err.message,
                                                        success: false,

                                                    });
                                                })
                                            } else {
                                                response.json({
                                                    message: "Ha ocurrido un error al actualizar la orden",
                                                    success: false
                                                });
                                            }
                                        }).catch((err: Error) => {
                                            response.json({
                                                message: err,
                                                success: false,
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
                                        message: err.message,
                                        success: false,
                                        que: "sdads"
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
                                message: err.message,
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
                    message: err.message,
                    success: false,
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