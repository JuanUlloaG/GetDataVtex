import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Orders from "../entity/Orders";
import State from "../entity/State";
import Service from "../entity/Services";
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

      if (profile == 4) populate = 'bag bag.deliveryId pickerId state service'

      findDocuments(Orders, query, "", {}, populate, '', 0, null, null).then((result: any) => {
        console.log(result)
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
      let query = { "key": 1 }
      findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
        if (findResultState.length > 0) {
          let stateId = findResultState[0]._id;
          const { id } = request.body
          if (id) {
            let query = { "_id": mongoose.Types.ObjectId(id) }
            let update = { "pickerId": null, startPickingDate: null, state: mongoose.Types.ObjectId(stateId) }
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
          } else {
            response.json({
              message: "Debe proporcionar el id de la orden",
              success: false
            });
          }
        } else {
          response.json({
            message: "Error al tomar la orden, no se ha encontrado un estado valido",
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: "Error al dejar la ordern: " + err.message,
          success: false
        });
      })

    } catch (error) {
      response.json({
        message: error.message,
        success: false
      });
    }
  }

  async picked(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      let query = { "key": 2 }
      findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
        if (findResultState.length > 0) {
          let stateId = findResultState[0]._id;
          const { id, pickerId } = request.body
          if (id) {
            let query = { "_id": mongoose.Types.ObjectId(id) }
            let update = { "pickerId": mongoose.Types.ObjectId(pickerId), startPickingDate: new Date(), state: mongoose.Types.ObjectId(stateId) }
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
        } else {
          response.json({
            message: "Error al tomar la orden, no se ha encontrado un estado valido",
            success: false
          });
        }

      }).catch((err: Error) => {
        response.json({
          message: "Error al tomar la ordern: " + err.message,
          success: false
        });
      })

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
      findDocuments(Service, {}, "", {}, '', '', 0, null, null).then((ServicesResult: Array<{ key: string, desc: string, typeDelivery: string }>) => {
        if (ServicesResult.length > 0) {
          let query = { "key": 0 }
          findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
            if (findResult.length > 0) {
              let orders: Array<any>;
              orders = request.body.orders;
              let stateId = findResult[0]._id;
              let _orders: Array<any> = [];
              orders.map((order, index) => {
                // Aqui la logica para determinar la mejor hora de despacho
                let deliveryDate = new Date()
                deliveryDate.setHours(new Date(order.date).getHours() + Math.floor(Math.random() * 6) + 1)
                // Fin logica para generar hora 
                let findService: any
                ServicesResult.map((service) => {
                  if (service.key == order.service) findService = Object.assign(service)
                })
                let _order = {
                  uid: mongoose.Types.ObjectId(request.body.uid),//Indentificador de empresa
                  state: mongoose.Types.ObjectId(stateId),
                  orderNumber: order.orderNumber,//Numero de la orden
                  products: order.products,
                  service: mongoose.Types.ObjectId(findService._id),
                  channel: order.channel,
                  client: order.client,
                  date: new Date(order.date),
                  realdatedelivery: new Date(deliveryDate),
                  pickerWorkShift: "Mañana"
                }
                _orders.push(_order)
              })

              insertManyDB(Orders, _orders).then((result: any) => {
                response.json({
                  mensaje: 'orden(es) creada(s) exitosamente',
                  data: result,
                  success: true
                });
              }).catch((err: Error) => {
                response.json({
                  message: err,
                  success: false
                });
              });
            } else {
              response.json({
                message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
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
            message: "Error al ingresar las ordenes, no se ha encontrado un servicio valido",
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