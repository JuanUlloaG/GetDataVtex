import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import xlsx from "xlsx";
const jwt = require('jsonwebtoken');
import Orders from "../entity/Orders";
import { OrderInterface } from "../entity/Orders";
import State from "../entity/State";
import Service from "../entity/Services";
const { initDB, insertDB, insertManyDB, findDocuments, findOneAndUpdateDB, findOneDB, updateManyDB } = require("../config/db")
import moment from 'moment'
import { ObjectID } from "mongodb";
// mongoose.set('debug', true);
export class OrdersController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      message: 'Listado de ordenes',
      data: [],
      success: true
    });

  }

  async updateState(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id, state, date } = request.body
      let queryOrder: any = { "_id": mongoose.Types.ObjectId(id) }
      let query = { "key": state }
      findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
        if (findResultState.length > 0) {
          let stateId = findResultState[0]._id;
          let updateOrder: any = { state: mongoose.Types.ObjectId(stateId) }
          if (state == 8) {
            updateOrder['cancellDate'] = new Date()
          }
          if (date) {
            updateOrder['realdatedelivery'] = new Date(date)
            updateOrder['restocked'] = true
          }
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

        } else {
          response.json({
            message: "Error al actualizar orden: " + findResultState,
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

  async updateReassignShop(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { ids, shopId } = request.body
      let arrayIds: any = []
      ids.map((id: string) => {
        arrayIds.push({ "_id": mongoose.Types.ObjectId(id) })
      })
      let queryOrder = { '_id': { '$in': ids } }
      let updateOrder: any = {}
      updateOrder['shopId'] = mongoose.Types.ObjectId(shopId)
      updateManyDB(Orders, queryOrder, updateOrder, null, null).then((updateOrder: any) => {
        if (updateOrder) {
          response.json({
            message: 'Ordenes actualizada exitosamente',
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

  async updateLogistic(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id, products } = request.body
      let queryOrder: any = { "_id": mongoose.Types.ObjectId(id) }

      let query = { "key": 0 }
      findDocuments(State, query, "", {}, '', '', 0, null, null).then((findResultState: Array<any>) => {
        if (findResultState.length > 0) {
          let stateId = findResultState[0]._id;
          // let updateOrder: any = { state: mongoose.Types.ObjectId(stateId) }
          let updateOrder: any = { products: products }
          updateOrder['isInShop'] = true
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

        } else {
          response.json({
            message: "Error al actualizar orden: " + findResultState,
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
      console.log(request.body)
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

      if (profile == 4) populate = 'bag deliveryId pickerId state service'

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

  async getOrderDetailById(request: Request, response: Response, next: NextFunction, app: any) {

    try {
      const { id } = request.body
      let query: object;
      let populate: string = '';

      query = { "_id": mongoose.Types.ObjectId(id) }
      populate = 'bag pickerId deliveryId state service'

      findOneDB(Orders, query, "", {}, populate, null, null).then((result: OrderInterface) => {
        if (Object.keys(result).length > 0) {
          if (!result.client.comment) result.set('client.comment', "Sin Comentarios", { strict: false })
          let pickername = ""
          let deliveryname = ""
          let pickingDate: any = ""
          let delilveryDateStart: any = ""
          let delilveryDateEnd: any = ""
          if (result.pickerId) pickername = result.pickerId.name
          if (result.deliveryId) deliveryname = result.deliveryId.name
          if (result.endPickingDate) pickingDate = result.endPickingDate
          if (result.starDeliveryDate) delilveryDateStart = result.starDeliveryDate
          if (result.endDeliveryDate) delilveryDateEnd = result.endDeliveryDate
          const rows = [
            this.createData('DateRange', result.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
            this.createData('AccessTime', result.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
            this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
          ];
          if (!result.client.comment) result.set('client.comment', "Sin Comentarios", { strict: false })
          result.set('timeLine', [...rows], { strict: false })
          response.json({
            message: 'Detalle de la orden',
            data: result,
            success: true
          });
        } else {
          response.json({
            message: 'No se encontro detalle de la orden',
            data: result,
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
        message: error,
        success: false
      });
    }
  }

  async getOrderDetailBynumber(request: Request, response: Response, next: NextFunction, app: any) {

    try {
      const { orderNumber } = request.body
      let query: object;
      let query_: any = {};
      let populate: string = '';

      query = { "orderNumber": orderNumber }
      populate = 'bag pickerId deliveryId state service'

      let queryState = { $or: [{ "key": 6 }, { "key": 7 }] }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        let arrayQuery: Array<any> = []
        if (findResult.length > 0) {
          findResult.map((stat) => {
            let stateId = stat._id;
            arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })
          })
          query_['$or'] = [...arrayQuery]
          query_['$and'] = [{ 'orderNumber': orderNumber }]

          findDocuments(Orders, query_, "", {}, populate, '', 1, null, null).then((result: Array<OrderInterface>) => {
            if (result.length > 0) {
              let newOrders = result.map((order, index) => {
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Detalle de la orden',
                data: newOrders[0],
                success: true
              });
            } else {
              response.json({
                message: 'No se encontro detalle de la orden',
                data: result,
                success: false
              });
            }

          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'No se encontraron estados',
            data: {},
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  createData(name: string, compra: any, picking: any, delivery: any, reception: any, type: number) {

    if (type == 0) {
      if (compra) {
        let _compra: Date = new Date(compra)
        let date = moment(compra, "YYYY-MM-DDTHH:MM:ss")
        compra = date.date() + '/' + (date.month() + 1) + '/' + date.year()
      }
      if (picking) {
        let _picking: Date = new Date(picking)
        let date = moment(picking, "YYYY-MM-DDTHH:MM:ss")
        picking = date.date() + '/' + (date.month() + 1) + '/' + date.year()
      }
      if (delivery) {
        let _delivery: Date = new Date(delivery);
        let date = moment(delivery, "YYYY-MM-DDTHH:MM:ss");
        delivery = date.date() + '/' + (date.month() + 1) + '/' + date.year()
      }
      if (reception) {
        let _reception: Date = new Date(reception)
        let date = moment(reception, "YYYY-MM-DDTHH:MM:ss")
        reception = date.date() + '/' + (date.month() + 1) + '/' + date.year()
      }
    }
    if (type == 1) {
      if (compra) {
        let date = moment(compra, "YYYY-MM-DDTHH:MM:ss")
        let _compra: Date = new Date(compra)
        compra = date.hours() + ':' + date.minutes()
      }
      if (picking) {
        let date = moment(picking, "YYYY-MM-DDTHH:MM:ss")
        let _picking: Date = new Date(picking)
        picking = date.hours() + ':' + date.minutes()
      }
      if (delivery) {
        let date = moment(delivery, "YYYY-MM-DDTHH:MM:ss")
        let _delivery: Date = new Date(delivery)
        delivery = date.hours() + ':' + date.minutes()
      }
      if (reception) {
        let date = moment(reception, "YYYY-MM-DDTHH:MM:ss")
        let _reception: Date = new Date(reception)
        reception = date.hours() + ':' + date.minutes()
      }
    }

    return { name, compra, picking, delivery, reception };
  }

  async ordersForOms(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, profile, state, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';

      if (profile == 4) populate = 'bag pickerId deliveryId state service shopId'

      let queryState: any
      queryState = { "key": 0 }
      if (state) {
        queryState = { "key": state }
      }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        if (findResult.length > 0) {
          let stateId = findResult[0]._id;
          if (state) {
            query_['state'] = mongoose.Types.ObjectId(stateId)
          }
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes',
                data: result,
                success: true
              });
            }


          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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


  async ordersForOmsCancelledExport(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, profile, state, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';

      if (profile == 4) populate = 'bag pickerId deliveryId state service shopId'

      let queryState: any
      queryState = { "key": 8 }


      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        if (findResult.length > 0) {
          let stateId = findResult[0]._id;
          let arrayQuery = []
          if (query && Object.keys(query).length > 0) {
            if (query.shopId) arrayQuery.push({ "shopId": mongoose.Types.ObjectId(query.shopId) })
            if (query.name) arrayQuery.push({ "client.name": query.name })
            if (query.address) arrayQuery.push({ "client.address": query.address })
          }
          if (stateId) arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })

          if (arrayQuery.length > 0)
            query_['$and'] = [...arrayQuery]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })

              try {
                let data = newOrders;
                //console.log(data)
                let headers = ["Numero de Pedido", "Nombre Cliente", "F. de compra", "F. de compromiso", "Canal", "Servicio", "Estado"];

                let reportdata = data.map(field => {
                  let file = '{"Numero de Pedido":"' + field.orderNumber + '","Nombre Cliente":"' + field.client.name + '","F. de compra":"' + field.date + '","F. de compromiso":"' +
                    field.realdatedelivery +
                    '","Canal":"' +
                    field.channel +
                    '","Servicio":"' +
                    field.service.desc +
                    '","Estado":"' +
                    field.state.desc +
                    '"}'
                  // console.log()
                  return JSON.parse(file);
                });
                let wb = xlsx.utils.book_new();
                let name = "Reporte_ordenes_canceladas.xlsx";
                let xlsData = xlsx.utils.json_to_sheet(reportdata, {
                  header: headers,
                });
                xlsx.utils.book_append_sheet(wb, xlsData, "Reporte");
                xlsx.writeFile(wb, name);
                response.download(name);
              } catch (err) {
                response.json({
                  message: err.message,
                  success: false
                });
              }

            } else {
              response.json({
                message: 'Sin data para exportar',
                success: false
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al Exportar ordenes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  async ordersForOmsCancelledSearch(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, profile, state, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';

      if (profile == 4) populate = 'bag pickerId deliveryId state service shopId'

      let queryState: any
      queryState = { "key": 8 }


      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        if (findResult.length > 0) {
          let stateId = findResult[0]._id;
          let arrayQuery = []
          if (query && Object.keys(query).length > 0) {
            if (query.shopId) arrayQuery.push({ "shopId": mongoose.Types.ObjectId(query.shopId) })
            if (query.name) arrayQuery.push({ "client.name": query.name })
            if (query.address) arrayQuery.push({ "client.address": query.address })
          }
          if (stateId) arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })

          if (arrayQuery.length > 0)
            query_['$and'] = [...arrayQuery]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes',
                data: result,
                success: true
              });
            }


          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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


  async ordersForOmsViewSearch(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, profile, state, shopId, query } = request.body
      let query_: any
      if (company) {
        query_ = { "shopId": mongoose.Types.ObjectId(shopId), "company": mongoose.Types.ObjectId(company) }
      } else {
        query_ = { "shopId": mongoose.Types.ObjectId(shopId) }
      }

      let populate: string = 'bag pickerId deliveryId state service shopId';
      findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
        if (result.length) {
          let newOrders = result.map((order, index) => {
            let pickername = ""
            let deliveryname = ""
            let pickingDate: any = ""
            let delilveryDateStart: any = ""
            let delilveryDateEnd: any = ""
            if (order.pickerId) pickername = order.pickerId.name
            if (order.deliveryId) deliveryname = order.deliveryId.name
            if (order.endPickingDate) pickingDate = order.endPickingDate
            if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
            if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
            const rows = [
              this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
              this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
              this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
            ];
            if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
            order.set('timeLine', [...rows], { strict: false })
            return order
          })
          response.json({
            message: 'Listado de ordenes',
            data: newOrders,
            success: true
          });
        } else {
          response.json({
            message: 'Listado de ordenes',
            data: result,
            success: true
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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


  async ordersForOmsFindIncident(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, shopId, orderNumber } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';
      let queryState: any

      queryState = { $or: [{ "key": 6 }, { "key": 7 }] }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        let arrayQuery: Array<any> = []
        if (findResult.length > 0) {
          findResult.map((stat) => {
            let stateId = stat._id;
            arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })
          })
          query_['$or'] = [...arrayQuery]
          let queryArr = []
          if (company) queryArr.push({ 'uid': mongoose.Types.ObjectId(company) })
          if (shopId) queryArr.push({ 'shopId': mongoose.Types.ObjectId(shopId) })
          if (orderNumber) queryArr.push({ 'orderNumber': orderNumber })
          if (company || shopId || orderNumber) query_['$and'] = [...queryArr]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes',
                data: result,
                success: true
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  async ordersForOmsFindReset(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, shopId } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';
      let queryState: any


      queryState = { $or: [{ "key": 2 }] }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        let arrayQuery: Array<any> = []
        if (findResult.length > 0) {
          findResult.map((stat) => {
            let stateId = stat._id;
            arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })
          })
          query_['$or'] = [...arrayQuery]
          let queryArr = []
          if (company) queryArr.push({ 'uid': mongoose.Types.ObjectId(company) })
          if (shopId) queryArr.push({ 'shopId': mongoose.Types.ObjectId(shopId) })
          if (shopId || company) query_['$and'] = [...queryArr]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes para resetear',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes para resetear error',
                data: result,
                success: false
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  async ordersForOmsFindReassing(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, shopId, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';
      let queryState: any
      queryState = { $or: [{ "key": 1 }] }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        let arrayQuery: Array<any> = []
        if (findResult.length > 0) {
          findResult.map((stat) => {
            let stateId = stat._id;
            arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })
          })
          if (Object.keys(query).length > 0) {
            if (query.buyFromDate && query.buyToDate) {
              arrayQuery.push({
                'date': {
                  $gte: new Date(query.buyFromDate),
                  $lt: new Date(query.buyToDate)
                }
              })
            }

            if (query.deliveryFromDate && query.deliveryToDate) {
              arrayQuery.push({
                'endDeliveryDate': {
                  $gte: new Date(query.deliveryFromDate),
                  $lt: new Date(query.deliveryToDate)
                }
              })
            }
            if (query.name) {
              arrayQuery.push({ 'pickerId.name': query.name })
            }
            if (query.number) {
              arrayQuery.push({ 'orderNumber': query.number })
            }
            if (query.shop) {
              arrayQuery.push({ 'shopId': query.shop })
            }
            if (query.service) {
              arrayQuery.push({ 'service': query.service })
            }
          }
          // query_['$and'] = [{ 'uid': mongoose.Types.ObjectId(company) }]
          if (company) query_['uid'] = mongoose.Types.ObjectId(company)
          if (shopId) arrayQuery.push({ 'shopId': mongoose.Types.ObjectId(shopId) })
          if (arrayQuery.length > 0)
            query_['$and'] = [...arrayQuery]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes para resetear',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes para resetear',
                data: result,
                success: true
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  async ordersForOmsFindSearchReset(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, shopId, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';
      let queryState: any
      queryState = { $or: [{ "key": 2 }] }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        let arrayQuery: Array<any> = []
        if (findResult.length > 0) {
          findResult.map((stat) => {
            let stateId = stat._id;
            // arrayQuery.push({ 'state': mongoose.Types.ObjectId(stateId) })
          })
          if (Object.keys(query).length > 0) {
            if (query.buyFromDate && query.buyToDate) {
              arrayQuery.push({
                'date': {
                  $gte: new Date(query.buyFromDate),
                  $lt: new Date(query.buyToDate)
                }
              })
            }
            if (query.buyFromDate && !query.buyToDate) {
              arrayQuery.push({
                'date': {
                  $gte: new Date(query.buyFromDate),
                  $lt: new Date()
                }
              })
            }

            if (query.deliveryFromDate && query.deliveryToDate) {
              arrayQuery.push({
                'endDeliveryDate': {
                  $gte: new Date(query.deliveryFromDate),
                  $lt: new Date(query.deliveryToDate)
                }
              })
            }
            if (query.deliveryFromDate && !query.deliveryToDate) {
              arrayQuery.push({
                'endDeliveryDate': {
                  $gte: new Date(query.deliveryFromDate),
                  $lt: new Date()
                }
              })
            }

            if (query.name) {
              arrayQuery.push({ 'pickerId.name': query.name })
            }

            if (query.number) {
              arrayQuery.push({ 'orderNumber': query.number })
            }

            if (query.shop) {
              arrayQuery.push({ 'shopId': query.shop })
            }

            if (query.service) {
              arrayQuery.push({ 'service': query.service })
            }
          }
          if (company) query_['uid'] = mongoose.Types.ObjectId(company)
          if (shopId) arrayQuery.push({ 'shopId': mongoose.Types.ObjectId(shopId) })
          if (arrayQuery.length > 0)
            query_['$and'] = [...arrayQuery]
          findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
            if (result.length) {
              let newOrders = result.map((order, index) => {
                let pickername = ""
                let deliveryname = ""
                let pickingDate: any = ""
                let delilveryDateStart: any = ""
                let delilveryDateEnd: any = ""
                if (order.pickerId) pickername = order.pickerId.name
                if (order.deliveryId) deliveryname = order.deliveryId.name
                if (order.endPickingDate) pickingDate = order.endPickingDate
                if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
                if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
                const rows = [
                  this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
                  this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
                  this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
                ];
                if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
                order.set('timeLine', [...rows], { strict: false })
                return order
              })
              response.json({
                message: 'Listado de ordenes para resetear',
                data: newOrders,
                success: true
              });
            } else {
              response.json({
                message: 'Listado de ordenes para resetear',
                data: result,
                success: true
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              success: false
            });
          });
        } else {
          response.json({
            message: 'Error al listar ordernes',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
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

  async ordersForOmsFindSearchHome(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, profile, query } = request.body
      let _query;
      let query_: any = {}
      let populate: string = 'bag pickerId deliveryId state service shopId';
      let queryState: any
      queryState = { $or: [{ "key": 2 }] }
      let arrayQuery: Array<any> = []

      if (Object.keys(query).length > 0) {
        if (query.buyFromDate && query.buyToDate) {
          arrayQuery.push({
            'date': {
              $gte: new Date(query.buyFromDate),
              $lt: new Date(query.buyToDate)
            }
          })
        }
        if (query.buyFromDate && !query.buyToDate) {
          arrayQuery.push({
            'date': {
              $gte: new Date(query.buyFromDate),
              $lt: new Date()
            }
          })
        }

        if (query.deliveryFromDate && query.deliveryToDate) {
          arrayQuery.push({
            'endDeliveryDate': {
              $gte: new Date(query.deliveryFromDate),
              $lt: new Date(query.deliveryToDate)
            }
          })
        }
        if (query.deliveryFromDate && !query.deliveryToDate) {
          arrayQuery.push({
            'endDeliveryDate': {
              $gte: new Date(query.deliveryFromDate),
              $lt: new Date()
            }
          })
        }
        if (query.rut) {
          arrayQuery.push({ 'client.rut': query.rut })
        }
        if (query.orderNumber) {
          arrayQuery.push({ 'orderNumber': query.orderNumber })
        }
        if (query.service) {
          arrayQuery.push({ 'service': mongoose.Types.ObjectId(query.service) })
        }
        if (query.shopId) {
          arrayQuery.push({ 'shopId': mongoose.Types.ObjectId(query.shopId) })
        }
        if (query.pickerName) {
          arrayQuery.push({ 'pickerId.name': query.pickerName })
        }
        if (query.deliveryName) {
          arrayQuery.push({ 'deliveryId.name': query.deliveryName })
        }
      }
      if (company) query_['uid'] = mongoose.Types.ObjectId(company)

      if (arrayQuery.length > 0)
        query_['$and'] = [...arrayQuery]

      findDocuments(Orders, query_, "", {}, populate, '', 0, null, null).then((result: Array<OrderInterface>) => {
        if (result.length) {
          let newOrders = result.map((order, index) => {
            let pickername = ""
            let deliveryname = ""
            let pickingDate: any = ""
            let delilveryDateStart: any = ""
            let delilveryDateEnd: any = ""
            if (order.pickerId) pickername = order.pickerId.name
            if (order.deliveryId) deliveryname = order.deliveryId.name
            if (order.endPickingDate) pickingDate = order.endPickingDate
            if (order.starDeliveryDate) delilveryDateStart = order.starDeliveryDate
            if (order.endDeliveryDate) delilveryDateEnd = order.endDeliveryDate
            const rows = [
              this.createData('DateRange', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 0),
              this.createData('AccessTime', order.date, pickingDate, delilveryDateStart, delilveryDateEnd, 1),
              this.createData('Person', "", pickername, deliveryname, deliveryname, 2)
            ];
            if (!order.client.comment) order.set('client.comment', "Sin Comentarios", { strict: false })
            order.set('timeLine', [...rows], { strict: false })
            return order
          })
          response.json({
            message: 'Listado de ordenes home',
            data: newOrders,
            success: true,
            orders: result.length
          });
        } else {
          response.json({
            message: 'Listado de ordenes home',
            data: result,
            success: true,
            orders: result.length
          });
        }
      }).catch((err: Error) => {
        console.log("Aqui")
        response.json({
          message: err,
          success: false,
          data: []
        });
      });
    } catch (error) {
      console.log("Aquisa")
      response.json({
        message: error,
        success: false,
        data: []
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
            let update = { "pickerId": null, startPickingDate: null, state: mongoose.Types.ObjectId(stateId), shopId: null }
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
          const { id, pickerId, shopId } = request.body
          console.log(shopId)
          if (id) {
            let query = { "_id": mongoose.Types.ObjectId(id) }
            let update = { "pickerId": mongoose.Types.ObjectId(pickerId), startPickingDate: new Date(), state: mongoose.Types.ObjectId(stateId), shopId: mongoose.Types.ObjectId(shopId) }
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
                  realdatedelivery: deliveryDate,
                  pickerWorkShift: "Mañana"
                }
                _orders.push(_order)
              })

              insertManyDB(Orders, _orders).then((result: any) => {
                response.json({
                  message: 'orden(es) creada(s) exitosamente',
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
        message: error.message,
        success: false
      });
    }
  }

  async ordersToDelivery(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      message: 'Listado de ordenes',
      data: [],
      success: true
    });
  }

  async remove(request: Request, response: Response, next: NextFunction, app: any) {

  }

  async auth(request: Request, response: Response, next: NextFunction, app: any) {
  }
}