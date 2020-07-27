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
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB, findOneDB } = require("../config/db");
const moment_1 = __importDefault(require("moment"));
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
                populate = 'bag deliveryId pickerId state service';
            findDocuments(Orders_1.default, query, "", {}, populate, '', 0, null, null).then((result) => {
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
    async getOrderDetailById(request, response, next, app) {
        try {
            const { id } = request.body;
            let query;
            let populate = '';
            query = { "_id": mongoose_1.default.Types.ObjectId(id) };
            populate = 'bag pickerId deliveryId state service';
            findOneDB(Orders_1.default, query, "", {}, populate, null, null).then((result) => {
                if (Object.keys(result).length > 0) {
                    if (!result.client.comment)
                        result.set('client.comment', "Sin Comentarios", { strict: false });
                    let pickername = "";
                    let deliveryname = "";
                    let pickingDate = "";
                    let delilveryDateStart = "";
                    let delilveryDateEnd = "";
                    if (result.pickerId)
                        pickername = result.pickerId.name;
                    if (result.deliveryId)
                        deliveryname = result.deliveryId.name;
                    if (result.endPickingDate)
                        pickingDate = result.endPickingDate;
                    if (result.starDeliveryDate)
                        delilveryDateStart = result.starDeliveryDate;
                    if (result.endDeliveryDate)
                        delilveryDateEnd = result.endDeliveryDate;
                    const rows = [
                        this.createData('DateRange', result.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                        this.createData('AccessTime', result.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                        this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                    ];
                    if (!result.client.comment)
                        result.set('client.comment', "Sin Comentarios", { strict: false });
                    result.set('timeLine', [...rows], { strict: false });
                    response.json({
                        message: 'Detalle de la orden',
                        data: result,
                        success: true
                    });
                }
                else {
                    response.json({
                        message: 'No se encontro detalle de la orden',
                        data: result,
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
    createData(name, compra, picking, delivery, reception, type) {
        if (type == 0) {
            if (compra) {
                let _compra = new Date(compra);
                let date = moment_1.default(compra, "YYYY-MM-DDTHH:MM:ss");
                compra = date.date() + '/' + (date.month() + 1) + '/' + date.year();
            }
            if (picking) {
                let _picking = new Date(picking);
                let date = moment_1.default(picking, "YYYY-MM-DDTHH:MM:ss");
                picking = date.date() + '/' + (date.month() + 1) + '/' + date.year();
            }
            if (delivery) {
                let _delivery = new Date(delivery);
                let date = moment_1.default(delivery, "YYYY-MM-DDTHH:MM:ss");
                delivery = date.date() + '/' + (date.month() + 1) + '/' + date.year();
            }
            if (reception) {
                let _reception = new Date(reception);
                let date = moment_1.default(reception, "YYYY-MM-DDTHH:MM:ss");
                reception = date.date() + '/' + (date.month() + 1) + '/' + date.year();
            }
        }
        if (type == 1) {
            if (compra) {
                let date = moment_1.default(compra, "YYYY-MM-DDTHH:MM:ss");
                let _compra = new Date(compra);
                compra = date.hours() + ':' + date.minutes();
            }
            if (picking) {
                let date = moment_1.default(picking, "YYYY-MM-DDTHH:MM:ss");
                let _picking = new Date(picking);
                picking = date.hours() + ':' + date.minutes();
            }
            if (delivery) {
                let date = moment_1.default(delivery, "YYYY-MM-DDTHH:MM:ss");
                let _delivery = new Date(delivery);
                delivery = date.hours() + ':' + date.minutes();
            }
            if (reception) {
                let date = moment_1.default(reception, "YYYY-MM-DDTHH:MM:ss");
                let _reception = new Date(reception);
                reception = date.hours() + ':' + date.minutes();
            }
        }
        return { name, compra, picking, delivery, reception };
    }
    async ordersForOms(request, response, next, app) {
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
                populate = 'bag bag.deliveryId pickerId deliveryId state service';
            findDocuments(Orders_1.default, query, "", {}, populate, '', 0, null, null).then((result) => {
                // console.log(result.length)
                if (result.length) {
                    let newOrders = result.map((order, index) => {
                        let pickername = "";
                        let deliveryname = "";
                        let pickingDate = "";
                        let delilveryDateStart = "";
                        let delilveryDateEnd = "";
                        if (order.pickerId)
                            pickername = order.pickerId.name;
                        if (order.deliveryId)
                            deliveryname = order.deliveryId.name;
                        if (order.endPickingDate)
                            pickingDate = order.endPickingDate;
                        if (order.starDeliveryDate)
                            delilveryDateStart = order.starDeliveryDate;
                        if (order.endDeliveryDate)
                            delilveryDateEnd = order.endDeliveryDate;
                        const rows = [
                            this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                            this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                            this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                        ];
                        if (!order.client.comment)
                            order.set('client.comment', "Sin Comentarios", { strict: false });
                        order.set('timeLine', [...rows], { strict: false });
                        return order;
                    });
                    response.json({
                        message: 'Listado de ordenes',
                        data: newOrders,
                        success: true
                    });
                }
                else {
                    response.json({
                        message: 'Listado de ordenes',
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
                                    realdatedelivery: deliveryDate,
                                    pickerWorkShift: "Mañana"
                                };
                                _orders.push(_order);
                            });
                            console.log(_orders);
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
