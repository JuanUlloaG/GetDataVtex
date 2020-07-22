import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Orders from "../entity/Orders";
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB } = require("../config/db")


export class OrdersController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });

  }

  async updateState(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id, state } = request.body
      let queryOrder = { "_id": mongoose.Types.ObjectId(id) }
      let updateOrder = { state: state }
      findOneAndUpdateDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: any) => {
        if (updateOrder) {
          response.json({
            message: 'Orden actualizada exitosamente',
            data: updateOrder,
            success: true
          });
        } else {
          response.json({
            message: "Error al actualizar orden: " + updateOrder,
            success: false
          });
        }

      }).catch((err: Error) => {
        response.json({
          message: err,
          success: false
        });
      });

    } catch (error) {
      response.json({
        message: error.message,
        success: false
      });
    }


  }

  async orders(request: Request, response: Response, next: NextFunction, app: any) {

    try {
      const { company, profile } = request.body
      let query: object;
      let populate: string = '';

      if (profile == 2) {
        query = {
          "uid": company,
          "pickerId": { "$eq": null }
        }
      } else {
        query = {}
      }
      console.log(profile)
      if (profile == 4) populate = 'bag'

      console.log(populate)

      findDocuments(Orders, query, "", {}, populate, '', 0, null, null).then((result: any) => {
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

  async leave(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id } = request.body
      if (id) {
        let query = { "_id": mongoose.Types.ObjectId(id) }
        let update = { "pickerId": null, startPickingDate: null }
        findOneAndUpdateDB(Orders, query, update, null, null).then((update: any) => {
          console.log("Leave: ", update)
          if (update) {
            response.json({
              message: 'Orden Tomada',
              data: update,
              success: true
            });
          } else {
            response.json({
              message: "Error al actualizar orden",
              success: false
            });
          }
        }).catch((err: Error) => {
          response.json({
            message: err,
            success: false
          });
        });
      } else {
        response.json({
          message: "Debe proporcionar el id de la orden",
          success: false
        });
      }
    } catch (error) {
      response.json({
        message: error.message,
        success: false
      });
    }
  }

  async picked(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id, pickerId } = request.body
      if (id) {
        let query = { "_id": mongoose.Types.ObjectId(id) }
        let update = { "pickerId": pickerId, startPickingDate: new Date() }
        let queryFind = { "_id": mongoose.Types.ObjectId(id) }
        findDocuments(Orders, queryFind, "", {}, '', '', 0, null, null).then((findResult: any) => {
          if (findResult.length > 0) {
            if (findResult[0].pickerId) {
              response.json({
                message: 'Orden Tomada',
                data: findResult[0],
                success: true
              });
            } else {
              findOneAndUpdateDB(Orders, query, update, null, null).then((update: any) => {
                if (update) {
                  response.json({
                    message: 'Orden Tomada',
                    data: update,
                    success: true
                  });
                } else {
                  response.json({
                    message: "Error al actualizar orden",
                    success: false
                  });
                }
              }).catch((err: Error) => {
                response.json({
                  message: err,
                  success: false
                });
              });
            }
          } else {
            response.json({
              message: "Error al actualizar orden",
              success: false
            });
          }
        }).catch((err: Error) => {
          response.json({
            message: err,
            success: false
          });
        });
      } else {
        response.json({
          message: "Debe proporcionar el id de la orden",
          success: false
        });
      }
    } catch (error) {
      response.json({
        message: error.message,
        success: false
      });
    }
  }

  /*
    Metodo que recibe un array de ordenes para guardarlas en la base de datos
 */
  async save(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      let orders: Array<any>;
      orders = request.body.orders
      let _orders: Array<any> = []
      let state = { key: "0", description: "En espera" }
      orders.map((order, index) => {
        let _order = {
          uid: mongoose.Types.ObjectId(request.body.uid),
          id: order.id,
          orderNumber: order.orderNumber,
          products: order.products,
          client: order.client,
          date: order.date,
          state: state,
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