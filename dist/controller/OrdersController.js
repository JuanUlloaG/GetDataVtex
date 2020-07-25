"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
const Orders_1 = __importDefault(require("../entity/Orders"));
const State_1 = __importDefault(require("../entity/State"));
const Services_1 = __importDefault(require("../entity/Services"));
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
    async updateState(request, response, next, app) {
        try {
            const { id, state } = request.body;
            let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(id) };
            let updateOrder = { state: state };
            findOneAndUpdateDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                if (updateOrder) {
                    response.json({
                        message: 'Orden actualizada exitosamente',
                        data: updateOrder,
                        success: true
                    });
                }
                else {
                    response.json({
                        message: "Error al actualizar orden: " + updateOrder,
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
    async orders(request, response, next, app) {
        try {
            const { company, profile } = request.body;
            let query;
            let populate = '';
            if (profile == 2) {
                query = {
                    "uid": company,
                    "pickerId": { "$eq": null }
                };
            }
            else {
                query = {};
            }
            if (profile == 4)
                populate = 'bag bag.deliveryId pickerId state service';
            findDocuments(Orders_1.default, query, "", {}, populate, '', 0, null, null).then((result) => {
                console.log(result);
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
            let query = { "key": 1 };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { id } = request.body;
                    if (id) {
                        let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                        let update = { "pickerId": null, startPickingDate: null, state: mongoose_1.default.Types.ObjectId(stateId) };
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
                else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: "Error al dejar la ordern: " + err.message,
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
    async picked(request, response, next, app) {
        try {
            let query = { "key": 2 };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    const { id, pickerId } = request.body;
                    if (id) {
                        let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                        let update = { "pickerId": mongoose_1.default.Types.ObjectId(pickerId), startPickingDate: new Date(), state: mongoose_1.default.Types.ObjectId(stateId) };
                        let queryFind = { "_id": mongoose_1.default.Types.ObjectId(id) };
                        findDocuments(Orders_1.default, queryFind, "", {}, '', '', 0, null, null).then((findResult) => {
                            if (findResult.length > 0) {
                                if (findResult[0].pickerId) {
                                    response.json({
                                        message: 'Orden Tomada',
                                        data: findResult[0],
                                        success: true
                                    });
                                }
                                else {
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
                else {
                    response.json({
                        message: "Error al tomar la orden, no se ha encontrado un estado valido",
                        success: false
                    });
                }
            }).catch((err) => {
                response.json({
                    message: "Error al tomar la ordern: " + err.message,
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
      Metodo que recibe un array de ordenes para guardarlas en la base de datos
   */
    async save(request, response, next, app) {
        try {
            findDocuments(Services_1.default, {}, "", {}, '', '', 0, null, null).then((ServicesResult) => {
                if (ServicesResult.length > 0) {
                    let query = { "key": 0 };
                    findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResult) => {
                        if (findResult.length > 0) {
                            let orders;
                            orders = request.body.orders;
                            let stateId = findResult[0]._id;
                            let _orders = [];
                            orders.map((order, index) => {
                                // Aqui la logica para determinar la mejor hora de despacho
                                let deliveryDate = new Date();
                                deliveryDate.setHours(new Date(order.date).getHours() + Math.floor(Math.random() * 6) + 1);
                                // Fin logica para generar hora 
                                let findService;
                                ServicesResult.map((service) => {
                                    if (service.key == order.service)
                                        findService = Object.assign(service);
                                });
                                let _order = {
                                    uid: mongoose_1.default.Types.ObjectId(request.body.uid),
                                    state: mongoose_1.default.Types.ObjectId(stateId),
                                    orderNumber: order.orderNumber,
                                    products: order.products,
                                    service: mongoose_1.default.Types.ObjectId(findService._id),
                                    channel: order.channel,
                                    client: order.client,
                                    date: new Date(order.date),
                                    realdatedelivery: new Date(deliveryDate),
                                    pickerWorkShift: "Mañana"
                                };
                                _orders.push(_order);
                            });
                            insertManyDB(Orders_1.default, _orders).then((result) => {
                                response.json({
                                    mensaje: 'orden(es) creada(s) exitosamente',
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
                                message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
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
                        message: "Error al ingresar las ordenes, no se ha encontrado un servicio valido",
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
