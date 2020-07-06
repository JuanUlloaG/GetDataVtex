"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const jwt = require('jsonwebtoken');
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
        response.json({
            mensaje: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async one(request, response, next, app) {
        return null;
    }
    /*
      Metodo que recibe un array de ordenes para guardarlas en la base de datos
   */
    async save(request, response, next, app) {
        let orders;
        orders = request.body.orders;
        let _orders;
        orders.map((order, index) => {
            let _order = {};
        });
        // response.json({
        //   mensaje: 'orden creada exitosamente',
        //   data: "s",
        //   success: true
        // });
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
