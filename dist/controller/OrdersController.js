"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jwt = require('jsonwebtoken');
const Orders_1 = __importDefault(require("../entity/Orders"));
const { initDB, insertDB, insertManyDB, findDocuments } = require("../config/db");
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
    async one(request, response, next, app) {
        return null;
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
