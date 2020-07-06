import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Order from "../entity/Orders";
const { initDB, insertDB, insertManyDB } = require("../config/db")


export class OrdersController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });

  }
  async orders(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });
  }

  async one(request: Request, response: Response, next: NextFunction, app: any) {
    return null
  }

  /*
    Metodo que recibe un array de ordenes para guardarlas en la base de datos
 */
  async save(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      let orders: Array<any>;
      orders = request.body.orders
      let _orders: Array<any> = []
      orders.map((order, index) => {
        let _order = {
          uid: mongoose.Types.ObjectId(request.body.uid),
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
        }
        _orders.push(_order)
      })

      await insertManyDB(Order, _orders)


      response.json({
        mensaje: 'orden creada exitosamente',
        data: "s",
        success: true
      });
    } catch (error) {
      console.log(error)
      response.json({
        mensaje: error.message,
        success: false
      });
    }
  }

  async ordersToDelivery(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });
  }

  async remove(request: Request, response: Response, next: NextFunction, app: any) {

  }

  async auth(request: Request, response: Response, next: NextFunction, app: any) {
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