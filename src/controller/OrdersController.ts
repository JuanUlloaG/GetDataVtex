import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Orders from "../entity/Orders";
const { initDB, insertDB, insertManyDB, findDocuments } = require("../config/db")


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

    try {
      const { company, profile } = request.body
      let query: object;
      if (profile == 2) {
        query = {
          "uid": company,
          "pickerId": { "$eq": null }
        }
      } else {
        query = {}
      }
      findDocuments(Orders, query, "", {}, '', '', 0, null, null).then((result: any) => {
        response.json({
          message: 'Listado de ordenes',
          data: result,
          success: true
        });
      }).catch((err: Error) => {
        response.json({
          message: err,
          success: false
        });
      });

    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }


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

      await insertManyDB(Orders, _orders)


      response.json({
        mensaje: 'orden creada exitosamente',
        data: "",
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
  }
}