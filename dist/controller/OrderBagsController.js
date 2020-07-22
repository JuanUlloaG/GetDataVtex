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
const OrderBags_2 = require("../entity/OrderBags");
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
const ajv_1 = __importDefault(require("ajv"));
var ajv = new ajv_1.default({ allErrors: true });
var validate = ajv.compile(OrderBags_2.schemaBags);
class OrderBagsController {
    // private userRepository = getRepository(User);
    async index(request, response, next, app) {
    }
    async listAllBags(request, response, next, app) {
        try {
            const { number } = request.body;
            let query;
            query = {
                "bags.bagNumber": number,
            };
            // if (shopId) {
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
            // } else {
            //     response.json({
            //         message: "Listado de bolsas necesita una tienda (Shop ID)",
            //         success: false
            //     });
            // }
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
                console.log(result.length);
                if (result.length) {
                    console.log("dsd", result[0].number);
                    let query = { "_id": mongoose_1.default.Types.ObjectId(result[0]._id) };
                    let update = { "number": result[0].number + 1 };
                    console.log(result[0].number + 1);
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
            let query;
            query = {
                "shopId": mongoose_1.default.Types.ObjectId(shopId),
                "deliveryId": mongoose_1.default.Types.ObjectId(deliveryId),
                "delivery": false
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
            const { id, deliveryId, orderId } = request.body;
            let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
            let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(orderId) };
            let updateOrder = { state: { key: "2", description: "Orden Recepcionada" }, starDeliveryDate: new Date() };
            let updateBag = { "deliveryId": mongoose_1.default.Types.ObjectId(deliveryId), "readyforDelivery": true };
            if (id && deliveryId) {
                findOneAndUpdateDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                    if (updateOrder) {
                        findOneAndUpdateDB(OrderBags_1.default, query, updateBag, null, null).then((update) => {
                            console.log(update);
                            if (update) {
                                response.json({
                                    message: 'Orden actualizada exitosamente',
                                    data: update,
                                    success: true
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
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async updateBagReceived(request, response, next, app) {
        try {
            const { id, comment, received, orderId } = request.body;
            if (id) {
                let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(orderId) };
                let updateOrder = { state: { key: "4", description: "Orden Despachada" }, endDeliveryDate: new Date() };
                let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                let update = { "comment": comment, "delivery": true, "received": received };
                findOneAndUpdateDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                    if (updateOrder) {
                        findOneAndUpdateDB(OrderBags_1.default, query, update, null, null).then((update) => {
                            if (update) {
                                response.json({
                                    message: 'Orden Actualizada correctamente',
                                    data: update,
                                    success: true
                                });
                            }
                            else {
                                console.log(update);
                                response.json({
                                    message: "Error al actualizar Bulto",
                                    success: false
                                });
                            }
                        }).catch((err) => {
                            console.log(err);
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
            const { orderNumber, bags, shopId, pickerId } = request.body;
            let bag = { orderNumber, bags, shopId, pickerId };
            let valid = validate(bag);
            if (valid) {
                bag.orderNumber = mongoose_1.default.Types.ObjectId(orderNumber);
                bag.shopId = mongoose_1.default.Types.ObjectId(shopId);
                bag.pickerId = mongoose_1.default.Types.ObjectId(pickerId);
                let query = { "_id": mongoose_1.default.Types.ObjectId(orderNumber) };
                let queryFind = { "orderNumber": mongoose_1.default.Types.ObjectId(orderNumber) };
                let update = { "pickerId": mongoose_1.default.Types.ObjectId(pickerId), bag: mongoose_1.default.Types.ObjectId(pickerId), "state": { key: "1", description: "Orden Pickeada" }, endPickingDate: new Date() };
                findDocuments(OrderBags_1.default, queryFind, "", {}, '', '', 0, null, null).then((findResult) => {
                    if (!findResult.length) {
                        insertDB(OrderBags_1.default, bag).then((result) => {
                            if (result) {
                                update['bag'] = mongoose_1.default.Types.ObjectId(result._id);
                                findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                                    response.json({
                                        message: 'Orden guardada exitosamente',
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
                                    message: "Ha ocurrido un error al actualizar la orden",
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
                            message: "No se puede agregar bolsa, orden ya tiene bulto(s) asignado(s)",
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
                    message: ajv.errorsText(validate.errors),
                    success: false
                });
            }
        }
        catch (error) {
            console.log(error);
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
