"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderBagsController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
const OrderBags_1 = __importDefault(require("../entity/OrderBags"));
const Orders_1 = __importDefault(require("../entity/Orders"));
const Bagnumber_1 = __importDefault(require("../entity/Bagnumber"));
const State_1 = __importDefault(require("../entity/State"));
const OrderBags_2 = require("../entity/OrderBags");
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB, executeProcedure, findOneDB } = require("../config/db");
const ajv_1 = __importDefault(require("ajv"));
const History_1 = __importDefault(require("../entity/History"));
var ajv = new ajv_1.default({ allErrors: true });
var validate = ajv.compile(OrderBags_2.schemaBags);
class OrderBagsController {
    async index(request, response, next, app) {
    }
    async listAllBags(request, response, next, app) {
        try {
            const { number } = request.body;
            let query;
            query = {
                "bags.bagNumber": number,
            };
            findDocuments(OrderBags_1.default, query, "", {}, 'orderNumber pickerId deliveryId', '', 0, null, null).then((result) => {
                if (result.length > 0) {
                    response.json({
                        message: 'Detalle de consulta',
                        data: result[0],
                        success: true
                    });
                }
                else {
                    response.json({
                        message: 'Detalle de consulta: No se encontraron ordenes asociadas',
                        data: {},
                        success: true
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
    async getNumber(request, response, next, app) {
        try {
            findDocuments(Bagnumber_1.default, {}, "", {}, '', '', 0, null, null).then((result) => {
                if (result.length) {
                    let query = { "_id": mongoose_1.default.Types.ObjectId(result[0]._id) };
                    let update = { "number": result[0].number + 1 };
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
                }
                else {
                    insertDB(Bagnumber_1.default, { number: '000000001' }).then((result) => {
                        response.json({
                            message: 'Number',
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
            }).catch((err) => {
                response.json({
                    message: err,
                    success: false
                });
            });
        }
        catch (error) {
        }
    }
    async listBags(request, response, next, app) {
        try {
            const { shopId, deliveryId } = request.body;
            let query = {};
            query = {
                "shopId": mongoose_1.default.Types.ObjectId(shopId),
                "deliveryId": mongoose_1.default.Types.ObjectId(deliveryId),
                "delivery": false
            };
            let queryState = {
                "key": { '$in': ["8", "7", "6"] }
            };
            if (shopId) {
                findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResultState) => {
                    if (findResultState.length > 0) {
                        let stateIds = [];
                        findResultState.map((state) => { stateIds.push(state._id); });
                        findDocuments(OrderBags_1.default, query, "", {}, 'orderNumber', '', 0, null, null).then((result) => {
                            let bagsResult = result.filter((bag) => !stateIds.includes(bag.orderNumber.state));
                            response.json({
                                message: 'Listado de bolsas a despachar',
                                data: bagsResult,
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
                            message: "Error al consultar estados, ",
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
                    message: "Listado de bolsas necesita una tienda (Shop ID)",
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
    async listBagsforTake(request, response, next, app) {
        try {
            const { shopId } = request.body;
            let query;
            query = {
                "shopId": shopId,
                "deliveryId": null
            };
            if (shopId) {
                findDocuments(OrderBags_1.default, query, "", {}, 'orderNumber', 'client orderNumber', 0, null, null).then((result) => {
                    response.json({
                        message: 'Listado de bolsas a despachar',
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
                    message: "Listado de bolsas necesita una tienda (Shop ID)",
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
    async updateBag(request, response, next, app) {
        try {
            let queryState = { "key": 4 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { id, deliveryId, orderId } = request.body;
                    let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                    let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(orderId) };
                    let updateOrder = { state: mongoose_1.default.Types.ObjectId(stateId), "deliveryId": mongoose_1.default.Types.ObjectId(deliveryId), starDeliveryDate: new Date() };
                    let updateBag = { "deliveryId": mongoose_1.default.Types.ObjectId(deliveryId), "readyforDelivery": true };
                    if (id && deliveryId) {
                        findOneAndUpdateDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags_1.default, query, updateBag, null, null).then((update) => {
                                    if (update) {
                                        let historyObj = {
                                            state: mongoose_1.default.Types.ObjectId(stateId),
                                            orderNumber: updateOrder.orderNumber,
                                            order: mongoose_1.default.Types.ObjectId(updateOrder._id),
                                            bag: mongoose_1.default.Types.ObjectId(id),
                                            shop: mongoose_1.default.Types.ObjectId(updateOrder.shopId),
                                            picker: mongoose_1.default.Types.ObjectId(updateOrder.pickerId),
                                            delivery: mongoose_1.default.Types.ObjectId(deliveryId),
                                            orderSnapShot: updateOrder,
                                            dateHistory: new Date()
                                        };
                                        insertDB(History_1.default, historyObj).then((result) => {
                                            if (result) {
                                                response.json({
                                                    message: 'Orden Actualizada correctamente',
                                                    data: update,
                                                    success: true
                                                });
                                            }
                                            else {
                                                response.json({
                                                    message: 'Error al actualizar la orden',
                                                    data: result,
                                                    success: true
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
                                            message: "Error al actualizar Bulto: " + update,
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
                                    message: "Error al actualizar Bulto: " + updateOrder,
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
                            message: "Parametros Faltantes",
                            success: false
                        });
                    }
                }
                else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
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
    //metodo donde se finaliza el despacho de la orden  
    async updateBagReceived(request, response, next, app) {
        try {
            let query = { "key": 5 };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let stateDesc = findResultState[0].desc;
                    const { id, comment, received, orderId } = request.body;
                    if (id) {
                        let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(orderId) };
                        let updateOrder = { state: mongoose_1.default.Types.ObjectId(stateId), endDeliveryDate: new Date(), received: received, comment: comment };
                        let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                        let update = { comment: comment, "delivery": true, received: received };
                        findOneAndUpdateDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                            if (updateOrder) {
                                findOneAndUpdateDB(OrderBags_1.default, query, update, null, null).then((update) => {
                                    if (update) {
                                        findOneDB(Orders_1.default, orderId, "", {}, '', '', 0, null, null).then((OrderResult) => {
                                            if (OrderResult) {
                                                let historyObj = {
                                                    state: mongoose_1.default.Types.ObjectId(stateId),
                                                    orderNumber: updateOrder.orderNumber,
                                                    order: mongoose_1.default.Types.ObjectId(OrderResult._id),
                                                    bag: mongoose_1.default.Types.ObjectId(id),
                                                    shop: mongoose_1.default.Types.ObjectId(OrderResult.shopId),
                                                    picker: mongoose_1.default.Types.ObjectId(OrderResult.pickerId),
                                                    delivery: mongoose_1.default.Types.ObjectId(OrderResult.deliveryId),
                                                    orderSnapShot: Object.assign({}, OrderResult.toJSON()),
                                                    dateHistory: new Date()
                                                };
                                                let param = {
                                                    "CuentaCliente": OrderResult.uid.name,
                                                    "OrderTrabajo": OrderResult.orderNumber,
                                                    "FechaEntregaReal": OrderResult.endDeliveryDate ? new Date(OrderResult.endDeliveryDate) : null,
                                                    "RUT_Delivery": OrderResult.pickerId.rut,
                                                    "Nombre_Delivery": OrderResult.pickerId.name,
                                                    "Apellido_Delivery": OrderResult.pickerId.lastname,
                                                    "FechaRecepcionDelivery": null,
                                                    "Estado": stateDesc,
                                                };
                                                insertDB(History_1.default, historyObj).then((result) => {
                                                    if (result) {
                                                        executeProcedure("[OMS].[Delivery]", param).then((result) => {
                                                            if (result) {
                                                                response.json({
                                                                    message: 'Orden Actualizada correctamente',
                                                                    data: update,
                                                                    success: true
                                                                });
                                                            }
                                                            else {
                                                                response.json({ message: "Error al ingresar las ordenes, Ha ocurrido algun error", success: false });
                                                            }
                                                        }).catch((err) => {
                                                            response.json({ message: err, success: false });
                                                        });
                                                    }
                                                    else {
                                                        response.json({
                                                            message: 'Error al actualizar la orden',
                                                            data: result,
                                                            success: true
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
                                                    message: 'Error al actualizar la orden',
                                                    success: true
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
                                            message: "Error al actualizar Bulto",
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
                                    message: "Error al actualizar Bulto: " + updateOrder,
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
                            message: "Debe proporcionar el id del bulto",
                            success: false
                        });
                    }
                }
                else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
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
                message: error.message,
                success: false
            });
        }
    }
    /*
      Metodo que recibe un array de bolsas para guardarlas en la base de datos
   */
    async save(request, response, next, app) {
        try {
            let query = { "key": 3 };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let stateDesc = findResultState[0].desc;
                    const { orderNumber, bags, shopId, pickerId } = request.body;
                    let bag = { orderNumber, bags, shopId, pickerId };
                    let valid = validate(bag);
                    let unitsPicked = 0;
                    let unitsReplaced = 0;
                    let unitsBroken = 0;
                    if (valid) {
                        bags.map((row) => {
                            row.products.map((bag) => {
                                unitsPicked = bag.unitsPicked + unitsPicked;
                                unitsReplaced = bag.unitsReplaced + unitsReplaced;
                                unitsBroken = bag.unitsBroken + unitsBroken;
                            });
                        });
                        bag.orderNumber = mongoose_1.default.Types.ObjectId(orderNumber);
                        bag.shopId = mongoose_1.default.Types.ObjectId(shopId);
                        bag.pickerId = mongoose_1.default.Types.ObjectId(pickerId);
                        let query = { "_id": mongoose_1.default.Types.ObjectId(orderNumber) };
                        let queryFind = { "orderNumber": mongoose_1.default.Types.ObjectId(orderNumber) };
                        let update = {
                            "pickerId": mongoose_1.default.Types.ObjectId(pickerId),
                            bag: mongoose_1.default.Types.ObjectId(pickerId),
                            shopId: mongoose_1.default.Types.ObjectId(shopId),
                            "state": mongoose_1.default.Types.ObjectId(stateId),
                            endPickingDate: new Date()
                        };
                        findDocuments(OrderBags_1.default, queryFind, "", {}, '', '', 0, null, null).then((findResult) => {
                            if (!findResult.length) {
                                insertDB(OrderBags_1.default, bag).then((result) => {
                                    if (result) {
                                        update['bag'] = mongoose_1.default.Types.ObjectId(result._id);
                                        findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                                            if (update) {
                                                findOneDB(Orders_1.default, orderNumber, "", {}, '', '', 0, null, null).then((OrderResult) => {
                                                    if (OrderResult) {
                                                        let historyObj = {
                                                            state: mongoose_1.default.Types.ObjectId(stateId),
                                                            orderNumber: update.orderNumber,
                                                            order: mongoose_1.default.Types.ObjectId(update._id),
                                                            bag: mongoose_1.default.Types.ObjectId(OrderResult.bag._id),
                                                            shop: mongoose_1.default.Types.ObjectId(shopId),
                                                            picker: mongoose_1.default.Types.ObjectId(pickerId),
                                                            delivery: null,
                                                            orderSnapShot: Object.assign({}, OrderResult.toJSON()),
                                                            dateHistory: new Date()
                                                        };
                                                        let param = {
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
                                                        };
                                                        insertDB(History_1.default, historyObj).then((result) => {
                                                            if (result) {
                                                                executeProcedure("[OMS].[PickingTerminado]", param).then((result) => {
                                                                    if (result) {
                                                                        response.json({
                                                                            message: 'Orden guardada exitosamente',
                                                                            data: result,
                                                                            success: true
                                                                        });
                                                                    }
                                                                    else {
                                                                        response.json({ message: "Error al ingresar las ordenes, Ha ocurrido algun error", success: false });
                                                                    }
                                                                }).catch((err) => {
                                                                    response.json({ message: err, success: false });
                                                                });
                                                            }
                                                            else {
                                                                response.json({
                                                                    message: 'Error al Tomar la orden',
                                                                    data: result,
                                                                    success: true
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
                                                            message: 'Error al Tomar la orden',
                                                            data: result,
                                                            success: true
                                                        });
                                                    }
                                                }).catch((err) => {
                                                    response.json({
                                                        message: err.message,
                                                        success: false,
                                                    });
                                                });
                                            }
                                            else {
                                                response.json({
                                                    message: "Ha ocurrido un error al actualizar la orden",
                                                    success: false
                                                });
                                            }
                                        }).catch((err) => {
                                            response.json({
                                                message: err,
                                                success: false,
                                            });
                                        });
                                    }
                                    else {
                                        response.json({
                                            message: "Ha ocurrido un error al actualizar la orden",
                                            success: false
                                        });
                                    }
                                }).catch((err) => {
                                    response.json({
                                        message: err.message,
                                        success: false,
                                        que: "sdads"
                                    });
                                });
                            }
                            else {
                                response.json({
                                    message: "No se puede agregar bolsa, orden ya tiene bulto(s) asignado(s)",
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
                    else {
                        response.json({
                            message: ajv.errorsText(validate.errors),
                            success: false
                        });
                    }
                }
                else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err.message,
                    success: false,
                });
            });
        }
        catch (error) {
            response.json({
                message: error.message,
                success: false
            });
        }
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
    }
}
exports.OrderBagsController = OrderBagsController;
