"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
const Orders_1 = __importDefault(require("../entity/Orders"));
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
class OrdersController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        response.json({
            mensaje: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async orders(request, response, next, app) {
        try {
            const { company, profile } = request.body;
            let query;
            if (profile == 2) {
                query = {
                    "uid": company,
                    "pickerId": { "$eq": null }
                };
            }
            else {
                query = {};
            }
            findDocuments(Orders_1.default, query, "", {}, '', '', 0, null, null).then((result) => {
                response.json({
                    message: 'Listado de ordenes',
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
        catch (error) {
            response.json({
                message: error,
                success: false
            });
        }
    }
    async leave(request, response, next, app) {
        try {
            const { id } = request.body;
            if (id) {
                let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                let update = { "pickerId": null };
                findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                    if (update) {
                        response.json({
                            message: 'Orden Tomada',
                            data: update,
                            success: true
                        });
                    }
                    else {
                        response.json({
                            message: "Error al actualizar orden",
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
                    message: "Debe proporcionar el id de la orden",
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
    async picked(request, response, next, app) {
        try {
            const { id, pickerId } = request.body;
            if (id) {
                let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                let update = { "pickerId": pickerId };
                let queryFind = { "_id": mongoose_1.default.Types.ObjectId(id) };
                findDocuments(Orders_1.default, queryFind, "", {}, '', '', 0, null, null).then((findResult) => {
                    if (findResult.length) {
                        if (findResult[0].pickerId)
                            response.json({
                                message: 'Orden Tomada',
                                data: findResult[0],
                                success: true
                            });
                        return;
                    }
                    findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                        if (update) {
                            response.json({
                                message: 'Orden Tomada',
                                data: update,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: "Error al actualizar orden",
                                success: false
                            });
                        }
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
                    message: "Debe proporcionar el id de la orden",
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
      Metodo que recibe un array de ordenes para guardarlas en la base de datos
   */
    async save(request, response, next, app) {
        try {
            let orders;
            orders = request.body.orders;
            let _orders = [];
            orders.map((order, index) => {
                let _order = {
                    uid: mongoose_1.default.Types.ObjectId(request.body.uid),
                    id: order.id,
                    orderNumber: order.orderNumber,
                    products: order.products,
                    client: order.client,
                    date: order.date,
                    startPickingDate: new Date(),
                    endPickingDate: new Date(),
                    starDeliveryDate: new Date(),
                    endDeliveryDate: new Date(),
                    realdatedelivery: new Date(),
                    pickerWorkShift: new Date()
                };
                _orders.push(_order);
            });
            await insertManyDB(Orders_1.default, _orders);
            response.json({
                mensaje: 'orden creada exitosamente',
                data: "",
                success: true
            });
        }
        catch (error) {
            console.log(error);
            response.json({
                mensaje: error.message,
                success: false
            });
        }
    }
    async ordersToDelivery(request, response, next, app) {
        response.json({
            mensaje: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
    }
}
exports.OrdersController = OrdersController;
