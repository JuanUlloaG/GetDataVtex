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
const OrderBags_2 = require("../entity/OrderBags");
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
const ajv_1 = __importDefault(require("ajv"));
var ajv = new ajv_1.default({ allErrors: true });
var validate = ajv.compile(OrderBags_2.schemaBags);
class OrderBagsController {
    // private userRepository = getRepository(User);
    async index(request, response, next, app) {
    }
    async listBags(request, response, next, app) {
        try {
            const { shopId } = request.body;
            let query;
            query = {
                "shopId": shopId
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
            const { id, deliveryId } = request.body;
            let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
            let update = { "devliveryId": mongoose_1.default.Types.ObjectId(deliveryId), "readyforDelivery": true };
            if (id && deliveryId) {
                findOneAndUpdateDB(OrderBags_1.default, query, update, null, null).then((update) => {
                    if (update) {
                        response.json({
                            message: 'Bulto actualizado exitosamente',
                            data: update,
                            success: true
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
            console.log("id");
            const { id, comment, received } = request.body;
            if (id) {
                let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                let update = { "comment": comment, "delivery": true, "received": received };
                findOneAndUpdateDB(OrderBags_1.default, query, update, null, null).then((update) => {
                    if (update) {
                        response.json({
                            message: 'Bulto actualizado exitosamente',
                            data: update,
                            success: true
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
                let update = { "pickerId": mongoose_1.default.Types.ObjectId(pickerId) };
                findDocuments(OrderBags_1.default, queryFind, "", {}, '', '', 0, null, null).then((findResult) => {
                    if (!findResult.length) {
                        findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                            insertDB(OrderBags_1.default, bag).then((result) => {
                                response.json({
                                    message: 'Bulto(s) guardado(s) exitosamente',
                                    data: result,
                                    success: true
                                });
                            }).catch((err) => {
                                response.json({
                                    message: err,
                                    success: false
                                });
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
