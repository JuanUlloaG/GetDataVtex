"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const jwt = require('jsonwebtoken');
// import { User } from "../entity/User";
const data = require("../mock.json");
const dataB = require("../mockBag.json");
class OrdersController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        console.log(data);
        response.json({
            mensaje: 'Listado de ordenes',
            data: data,
            success: true
        });
    }
    async orders(request, response, next, app) {
        console.log(data);
        response.json({
            mensaje: 'Listado de ordenes',
            data: data,
            success: true
        });
    }
    async one(request, response, next, app) {
        return null;
    }
    async save(request, response, next, app) {
        response.json({
            mensaje: 'orden actualizada correctamente',
            data: "s",
            success: true
        });
    }
    async ordersToDelivery(request, response, next, app) {
        response.json({
            mensaje: 'Listado de ordenes',
            data: dataB,
            success: true
        });
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
        // const payload = {
        //   check: true
        // };
        // const token = jwt.sign(payload, app.get('key'), {});
        // response.json({
        //   mensaje: 'Autentication successfull',
        //   token: token,
        //   perfil: "1"
        // });
        // try {
        //   admin.auth().getUser(request.body.uid).then((result: any) => {
        //     response.json({
        //       mensaje: 'Autentication successfull',
        //       token: token,
        //       uid: result.uid
        //     });
        //   }).catch((err: any) => {
        //     response.json({ mensaje: "Ha ocurrido algun error: " + err.message })
        //   });
        // } catch (error) {
        //   response.json({ mensaje: "Ha ocurrido algun error: " + error.message })
        // }
    }
}
exports.OrdersController = OrdersController;
