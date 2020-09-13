"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const xlsx_1 = __importDefault(require("xlsx"));
const jwt = require('jsonwebtoken');
const Orders_1 = __importDefault(require("../entity/Orders"));
const State_1 = __importDefault(require("../entity/State"));
const Services_1 = __importDefault(require("../entity/Services"));
const { insertDB, insertManyDB, findDocuments, findDocumentsMultiPopulate, findOneAndUpdateDB, findOneDB, updateManyDB, executeProcedure } = require("../config/db");
const moment_1 = __importDefault(require("moment"));
const History_1 = __importDefault(require("../entity/History"));
const Company_1 = __importDefault(require("../entity/Company"));
// mongoose.set('debug', true);
class OrdersController {
    async all(request, response, next, app) {
        response.json({
            message: 'Listado de ordenes',
            data: [],
            success: true
        });
    }
    async updateState(request, response, next, app) {
        try {
            const { id, state, date } = request.body;
            let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(id) };
            let query = { "key": state };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let updateOrder = { state: mongoose_1.default.Types.ObjectId(stateId) };
                    if (state == 8) {
                        updateOrder['cancellDate'] = new Date();
                    }
                    if (date) {
                        updateOrder['realdatedelivery'] = new Date(date);
                        updateOrder['restocked'] = true;
                    }
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
                else {
                    response.json({
                        message: "Error al actualizar orden: " + findResultState,
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
    async updateReassignShop(request, response, next, app) {
        try {
            const { ids, shopId } = request.body;
            let arrayIds = [];
            ids.map((id) => {
                arrayIds.push({ "_id": mongoose_1.default.Types.ObjectId(id) });
            });
            let queryOrder = { '_id': { '$in': ids } };
            let updateOrder = {};
            updateOrder['shopId'] = mongoose_1.default.Types.ObjectId(shopId);
            updateManyDB(Orders_1.default, queryOrder, updateOrder, null, null).then((updateOrder) => {
                if (updateOrder) {
                    response.json({
                        message: 'Ordenes actualizada exitosamente',
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
    async updateLogistic(request, response, next, app) {
        try {
            const { id, products } = request.body;
            let queryOrder = { "_id": mongoose_1.default.Types.ObjectId(id) };
            let query = { "key": 0 };
            findDocuments(State_1.default, query, "", {}, '', '', 0, null, null).then((findResultState) => {
                if (findResultState.length > 0) {
                    let stateId = findResultState[0]._id;
                    let updateOrder = { products: products };
                    updateOrder['isInShop'] = true;
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
                else {
                    response.json({
                        message: "Error al actualizar orden: " + findResultState,
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
    async ordersTest(request, response, next, app) {
        try {
            let query;
            let populate = '';
            query = {};
            let _populate = {
                path: 'uid',
            };
            let _populate1 = {
                path: 'bag',
                populate: {
                    path: 'shopId'
                }
            };
            let _populate2 = {
                path: 'state',
            };
            let _populate3 = {
                path: 'deliveryId',
                populate: {
                    path: 'company'
                }
            };
            let _populate4 = {
                path: 'pickerId',
                populate: {
                    path: 'company'
                }
            };
            let _populate5 = {
                path: 'service',
            };
            let _populate6 = {
                path: 'shopId',
            };
            findDocumentsMultiPopulate(Orders_1.default, query, "", {}, _populate, _populate1, _populate2, _populate3, _populate4, _populate5, _populate6, '', 0, null, null).then((result) => {
                let ordersToReturn = [];
                result.map((order, index) => {
                    let shopname = "", pickername = "", pickerrut = "", pickercompany = "", deliveryname = "", deliveryrut = "", deliverycompany = "", bagdelivery = "", bagrecived = "", tienda = "", cliente = "";
                    let keys = Object.keys(order);
                    let orderReturn = {};
                    orderReturn['tercero'] = order.client.third;
                    orderReturn['clienteRut'] = order.client.rut;
                    orderReturn['clienteComuna'] = order.client.comuna;
                    orderReturn['clienteCiudad'] = order.client.ciudad;
                    orderReturn['clienteLongitud'] = order.client.long;
                    orderReturn['clienteLatitud'] = order.client.lat;
                    if (order.shopId)
                        shopname = order.shopId.number;
                    orderReturn['tienda'] = shopname;
                    if (order.pickerId)
                        pickername = order.pickerId.name;
                    orderReturn['pickerNombre'] = pickername;
                    if (order.pickerId)
                        pickerrut = order.pickerId.rut;
                    orderReturn['pickerRut'] = pickerrut;
                    if (order.pickerId)
                        pickercompany = order.pickerId.company.name;
                    orderReturn['pickerCuenta'] = pickercompany;
                    if (order.deliveryId)
                        deliveryname = order.deliveryId.name;
                    orderReturn['deliveryNombre'] = deliveryname;
                    if (order.deliveryId)
                        deliveryrut = order.deliveryId.rut;
                    orderReturn['deliveryRut'] = deliveryrut;
                    if (order.deliveryId)
                        deliverycompany = order.deliveryId.company.name;
                    orderReturn['deliveryCuenta'] = deliverycompany;
                    if (order.bag)
                        bagdelivery = order.bag.delivery;
                    orderReturn['bultoDelivery'] = bagdelivery;
                    if (order.bag)
                        bagrecived = order.bag.received;
                    orderReturn['bultoRecived'] = bagrecived;
                    orderReturn['numeroOrden'] = order.orderNumber;
                    if (order.uid)
                        cliente = order.uid.name;
                    orderReturn['cliente'] = cliente;
                    orderReturn['inicioPicking'] = order.startPickingDate;
                    orderReturn['finPicking'] = order.endPickingDate;
                    orderReturn['inicioDelivery'] = order.starDeliveryDate;
                    orderReturn['finDelivery'] = order.endDeliveryDate;
                    orderReturn['fechaCancelado'] = order.cancellDate;
                    orderReturn['fechaComromiso'] = order.realdatedelivery;
                    orderReturn['isInShop'] = order.isInShop;
                    orderReturn['restocked'] = order.restocked;
                    orderReturn['estadoId'] = order.state.key;
                    orderReturn['estadoDesc'] = order.state.desc;
                    orderReturn['servicioId'] = order.service.key;
                    orderReturn['servicioTipo'] = order.service.typeDelivery;
                    orderReturn['canal'] = order.channel;
                    orderReturn['fechaCompra'] = order.date;
                    orderReturn['turno'] = order.pickerWorkShift;
                    if (order.bag) {
                        //aqui se sacan los productos si hay un bulto hecho
                        order.bag.bags.map((bag) => {
                            bag.products.map((producto) => {
                                orderReturn['numeroBulto'] = producto.bagNumber;
                                orderReturn['productoUnidadesPicked'] = producto.unitsPicked;
                                orderReturn['productoUnidadesSusti'] = producto.unitsSubstitutes;
                                orderReturn['productoUnidadesBroke'] = producto.unitsBroken;
                                orderReturn['productoUnidadesReplace'] = producto.unitsReplaced;
                                orderReturn['productoRecepcion'] = '';
                                orderReturn['productoId'] = producto.id;
                                orderReturn['productoCodigoBarra'] = producto.barcode;
                                orderReturn['producto'] = producto.product;
                                orderReturn['productoUnidades'] = producto.units;
                                orderReturn['productoUbicacion'] = producto.location;
                                ordersToReturn.push(orderReturn);
                            });
                        });
                    }
                    else {
                        //aqui se sacan los productos si no hay un bulto hecho
                        order.products.map((producto) => {
                            orderReturn['numeroBulto'] = '';
                            orderReturn['productoUnidadesPicked'] = producto.unitsPicked;
                            orderReturn['productoUnidadesSusti'] = producto.unitsSubstitutes;
                            orderReturn['productoUnidadesBroke'] = producto.unitsBroken;
                            orderReturn['productoUnidadesReplace'] = producto.unitsReplaced;
                            orderReturn['productoRecepcion'] = producto.reception;
                            orderReturn['productoId'] = producto.id;
                            orderReturn['productoCodigoBarra'] = producto.barcode;
                            orderReturn['producto'] = producto.product;
                            orderReturn['productoUnidades'] = producto.units;
                            orderReturn['productoUbicacion'] = producto.location;
                            ordersToReturn.push(orderReturn);
                        });
                    }
                });
                response.json({
                    result: ordersToReturn
                });
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
    async getOrderDetailBynumber(request, response, next, app) {
        try {
            const { orderNumber } = request.body;
            let query;
            let query_ = {};
            let populate = '';
            query = { "orderNumber": orderNumber };
            populate = 'bag pickerId deliveryId state service';
            let queryState = { $or: [{ "key": 6 }, { "key": 7 }] };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                let arrayQuery = [];
                if (findResult.length > 0) {
                    findResult.map((stat) => {
                        let stateId = stat._id;
                        arrayQuery.push({ 'state': mongoose_1.default.Types.ObjectId(stateId) });
                    });
                    query_['$or'] = [...arrayQuery];
                    query_['$and'] = [{ 'orderNumber': orderNumber }];
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 1, null, null).then((result) => {
                        if (result.length > 0) {
                            let newOrders = result.map((order, index) => {
                                if (!order.client.comment)
                                    order.set('client.comment', "Sin Comentarios", { strict: false });
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
                                message: 'Detalle de la orden',
                                data: newOrders[0],
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
                            message: err.message,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: 'No se encontraron estados',
                        data: {},
                        success: false
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
            const { company, profile, state, query } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            if (profile == 4)
                populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { "key": 0 };
            if (state) {
                queryState = { "key": state };
            }
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (state) {
                        query_['state'] = mongoose_1.default.Types.ObjectId(stateId);
                    }
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsCancelledExport(request, response, next, app) {
        try {
            const { company, profile, state, query } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            if (profile == 4)
                populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { "key": 8 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    let arrayQuery = [];
                    if (query && Object.keys(query).length > 0) {
                        if (query.shopId)
                            arrayQuery.push({ "shopId": mongoose_1.default.Types.ObjectId(query.shopId) });
                        if (query.name)
                            arrayQuery.push({ "client.name": query.name });
                        if (query.address)
                            arrayQuery.push({ "client.address": query.address });
                    }
                    if (stateId)
                        arrayQuery.push({ 'state': mongoose_1.default.Types.ObjectId(stateId) });
                    if (arrayQuery.length > 0)
                        query_['$and'] = [...arrayQuery];
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                            try {
                                let data = newOrders;
                                let headers = ["Numero de Pedido", "Nombre Cliente", "F. de compra", "F. de compromiso", "Canal", "Servicio", "Estado"];
                                let reportdata = data.map(field => {
                                    let file = `{
                      "Numero de Pedido":"${field.orderNumber}",
                      "Nombre Cliente":"${field.client.name}",
                      "F. de compra":"${moment_1.default(field.date).format("DD/MM/YYYY HH:mm")}",
                      "F. de compromiso":"${moment_1.default(field.realdatedelivery).format("DD/MM/YYYY HH:mm")}",
                      "Canal":"${field.channel}",
                      "Servicio":"${field.service.desc}",
                      "Estado":"${field.state.desc}"
                    }`;
                                    return JSON.parse(file);
                                });
                                let wb = xlsx_1.default.utils.book_new();
                                let name = "Reporte_ordenes_canceladas.xlsx";
                                let xlsData = xlsx_1.default.utils.json_to_sheet(reportdata, {
                                    header: headers,
                                });
                                xlsx_1.default.utils.book_append_sheet(wb, xlsData, "Reporte");
                                xlsx_1.default.writeFile(wb, name);
                                response.download(name);
                            }
                            catch (err) {
                                response.json({
                                    message: err.message,
                                    success: false
                                });
                            }
                        }
                        else {
                            response.json({
                                message: 'Sin data para exportar',
                                success: false
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err.message,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: 'Error al Exportar ordenes',
                        success: false
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
    async ordersForOmsCancelledSearch(request, response, next, app) {
        try {
            const { company, profile, state, query } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            if (profile == 4)
                populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { "key": 8 };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = findResult[0]._id;
                    if (stateId)
                        query_['state'] = mongoose_1.default.Types.ObjectId(stateId);
                    if (query && Object.keys(query).length > 0) {
                        if (query.buyDate) {
                            let from = new Date(query.buyDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['date'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.cancellDate) {
                            let from = new Date(query.cancellDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['cancellDate'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.shopId)
                            query_['shopId'] = mongoose_1.default.Types.ObjectId(query.shopId);
                    }
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsViewSearch(request, response, next, app) {
        try {
            const { company, profile, state, shopId, query } = request.body;
            let query_ = {};
            if (company) {
                query_["company"] = mongoose_1.default.Types.ObjectId(company);
            }
            if (shopId) {
                query_["shopId"] = mongoose_1.default.Types.ObjectId(shopId);
            }
            let queryState;
            queryState = { "key": { $in: [5, 6, 7, 8] } };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                if (findResult.length > 0) {
                    let stateId = [];
                    findResult.map((state) => {
                        stateId.push(mongoose_1.default.Types.ObjectId(state._id));
                    });
                    if (stateId)
                        query_['state'] = { $nin: stateId };
                    findDocuments(Orders_1.default, query_, "", {}, '', '', 0, null, null).then((result) => {
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
                else { }
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
    async ordersForOmsFindIncident(request, response, next, app) {
        try {
            const { company, shopId, orderNumber } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { "key": { $in: [6, 7] } };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                let arrayQuery = [];
                if (findResult.length > 0) {
                    findResult.map((stat) => {
                        let stateId = stat._id;
                        arrayQuery.push(mongoose_1.default.Types.ObjectId(stateId));
                    });
                    query_['state'] = { $in: arrayQuery };
                    if (company)
                        query_['uid'] = mongoose_1.default.Types.ObjectId(company);
                    if (shopId)
                        query_['shopId'] = mongoose_1.default.Types.ObjectId(shopId);
                    if (orderNumber)
                        query_['orderNumber'] = { $regex: orderNumber };
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsFindReset(request, response, next, app) {
        try {
            const { company, shopId } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { $or: [{ "key": { $in: [1, 2] } }] };
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                let arrayQuery = [];
                if (findResult.length > 0) {
                    findResult.map((stat) => {
                        let stateId = stat._id;
                        arrayQuery.push(mongoose_1.default.Types.ObjectId(stateId));
                    });
                    query_['state'] = { $in: [...arrayQuery] };
                    if (company)
                        query_['uid'] = mongoose_1.default.Types.ObjectId(company);
                    if (shopId)
                        query_['shopId'] = mongoose_1.default.Types.ObjectId(shopId);
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                                message: 'Listado de ordenes para resetear',
                                data: newOrders,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: 'Listado de ordenes para resetear error',
                                data: result,
                                success: false
                            });
                        }
                    }).catch((err) => {
                        response.json({
                            message: err.message,
                            success: false
                        });
                    });
                }
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsFindReassing(request, response, next, app) {
        try {
            const { company, shopId, query } = request.body;
            let _query;
            let query_ = {};
            let pickerName;
            let populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            queryState = { $or: [{ "key": 1 }] };
            console.log(query);
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                let arrayQuery = [];
                if (findResult.length > 0) {
                    findResult.map((stat) => {
                        let stateId = stat._id;
                        query_['state'] = mongoose_1.default.Types.ObjectId(stateId);
                    });
                    if (Object.keys(query).length > 0) {
                        if (query.buyFromDate && query.buyToDate) {
                            let from = new Date(query.buyFromDate);
                            let to = new Date(query.buyToDate);
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['date'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.buyFromDate && !query.buyToDate) {
                            let from = new Date(query.buyFromDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            query_['date'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.deliveryFromDate && query.deliveryToDate) {
                            let from = new Date(query.deliveryFromDate);
                            let to = new Date(query.deliveryToDate);
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['realdatedelivery'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.deliveryFromDate && !query.deliveryToDate) {
                            let from = new Date(query.deliveryFromDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['realdatedelivery'] = {
                                $gte: from,
                                $lt: from
                            };
                        }
                        if (query.name) {
                            pickerName = query.name;
                            query_['pickerId'] = { $ne: null };
                        }
                        if (query.number) {
                            query_['orderNumber'] = { $regex: query.number };
                        }
                        if (query.service) {
                            query_['service'] = mongoose_1.default.Types.ObjectId(query.service);
                        }
                        if (query.shop) {
                            query_['shopId'] = mongoose_1.default.Types.ObjectId(query.shop);
                        }
                    }
                    // query_['$and'] = [{ 'uid': mongoose.Types.ObjectId(company) }]
                    if (company)
                        query_['uid'] = mongoose_1.default.Types.ObjectId(company);
                    // if (shopId) arrayQuery.push({ 'shopId': mongoose.Types.ObjectId(shopId) })
                    // if (arrayQuery.length > 0)
                    //   query_['$and'] = [...arrayQuery]
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                            let filterOrders = newOrders.filter((orders) => {
                                if (pickerName) {
                                    if (pickerName) {
                                        if (orders.pickerId.name.toLowerCase().indexOf(pickerName.toLowerCase()) !== -1)
                                            return orders;
                                    }
                                }
                                else {
                                    return orders;
                                }
                            });
                            response.json({
                                message: 'Listado de ordenes para resetear',
                                data: filterOrders,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: 'Listado de ordenes para resetear',
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
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsFindSearchReset(request, response, next, app) {
        try {
            const { company, shopId, query } = request.body;
            let _query;
            let query_ = {};
            let populate = 'bag pickerId deliveryId state service shopId';
            let queryState;
            let pickerName;
            queryState = { $or: [{ "key": 1 }] };
            console.log("update", query);
            findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
                let arrayQuery = [];
                if (findResult.length > 0) {
                    findResult.map((stat) => {
                        let stateId = stat._id;
                        query_['state'] = mongoose_1.default.Types.ObjectId(stateId);
                    });
                    if (Object.keys(query).length > 0) {
                        if (query.buyFromDate && query.buyToDate) {
                            let from = new Date(query.buyFromDate);
                            let to = new Date(query.buyToDate);
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['date'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.buyFromDate && !query.buyToDate) {
                            let from = new Date(query.buyFromDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            query_['date'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.deliveryFromDate && query.deliveryToDate) {
                            let from = new Date(query.deliveryFromDate);
                            let to = new Date(query.deliveryToDate);
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['realdatedelivery'] = {
                                $gte: from,
                                $lt: to
                            };
                        }
                        if (query.deliveryFromDate && !query.deliveryToDate) {
                            let from = new Date(query.deliveryFromDate);
                            let to = new Date();
                            from.setHours(0);
                            from.setMinutes(0);
                            from.setSeconds(0);
                            to.setHours(23);
                            to.setMinutes(59);
                            to.setSeconds(59);
                            query_['realdatedelivery'] = {
                                $gte: from,
                                $lt: from
                            };
                        }
                        if (query.name) {
                            pickerName = query.name;
                            query_['pickerId'] = { $ne: null };
                        }
                        if (query.number) {
                            query_['orderNumber'] = { $regex: query.number };
                        }
                        if (query.service) {
                            query_['service'] = mongoose_1.default.Types.ObjectId(query.service);
                        }
                        if (query.shop) {
                            query_['shopId'] = mongoose_1.default.Types.ObjectId(query.shop);
                        }
                    }
                    if (company)
                        query_['uid'] = mongoose_1.default.Types.ObjectId(company);
                    // if (arrayQuery.length > 0)
                    //   query_['$and'] = [...arrayQuery]
                    findDocuments(Orders_1.default, query_, "", {}, populate, '', 0, null, null).then((result) => {
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
                            let filterOrders = newOrders.filter((orders) => {
                                if (pickerName) {
                                    if (pickerName) {
                                        if (orders.pickerId.name.toLowerCase().indexOf(pickerName.toLowerCase()) !== -1)
                                            return orders;
                                    }
                                }
                                else {
                                    return orders;
                                }
                            });
                            response.json({
                                message: 'Listado de ordenes para resetear',
                                data: filterOrders,
                                success: true
                            });
                        }
                        else {
                            response.json({
                                message: 'Listado de ordenes para resetear',
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
                else {
                    response.json({
                        message: 'Error al listar ordernes',
                        success: false
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
    async ordersForOmsFindSearchHome(request, response, next, app) {
        try {
            const { company, profile, query } = request.body;
            let _query;
            let query_ = {};
            let _populate1 = {};
            let _populate2 = {};
            let namePicker = "";
            let nameDelivery = "";
            let populate = '';
            let queryState;
            queryState = { $or: [{ "key": 2 }] };
            let arrayQuery = [];
            if (Object.keys(query).length > 0) {
                if (query.buyFromDate && query.buyToDate) {
                    let from = new Date(query.buyFromDate);
                    let to = new Date(query.buyToDate);
                    from.setHours(0);
                    from.setMinutes(0);
                    from.setSeconds(0);
                    to.setHours(23);
                    to.setMinutes(59);
                    to.setSeconds(59);
                    query_['date'] = {
                        $gte: from,
                        $lt: to
                    };
                }
                if (query.buyFromDate && !query.buyToDate) {
                    let from = new Date(query.buyFromDate);
                    let to = new Date();
                    from.setHours(0);
                    from.setMinutes(0);
                    from.setSeconds(0);
                    query_['date'] = {
                        $gte: from,
                        $lt: to
                    };
                }
                if (query.deliveryFromDate && query.deliveryToDate) {
                    let from = new Date(query.deliveryFromDate);
                    let to = new Date(query.deliveryToDate);
                    from.setHours(0);
                    from.setMinutes(0);
                    from.setSeconds(0);
                    to.setHours(23);
                    to.setMinutes(59);
                    to.setSeconds(59);
                    query_['realdatedelivery'] = {
                        $gte: from,
                        $lt: to
                    };
                }
                if (query.deliveryFromDate && !query.deliveryToDate) {
                    let from = new Date(query.deliveryFromDate);
                    let to = new Date();
                    from.setHours(0);
                    from.setMinutes(0);
                    from.setSeconds(0);
                    to.setHours(23);
                    to.setMinutes(59);
                    to.setSeconds(59);
                    query_['realdatedelivery'] = {
                        $gte: from,
                        $lt: from
                    };
                }
                if (query.rut) {
                    query_['client.rut'] = { $regex: new RegExp(query.rut, "i") };
                }
                if (query.orderNumber) {
                    query_['orderNumber'] = { $regex: query.orderNumber };
                }
                if (query.service) {
                    query_['service'] = mongoose_1.default.Types.ObjectId(query.service);
                }
                if (query.shopId) {
                    query_['shopId'] = mongoose_1.default.Types.ObjectId(query.shopId);
                }
                if (query.pickerName) {
                    namePicker = query.pickerName;
                    query_['pickerId'] = { $ne: null };
                }
                if (query.deliveryName) {
                    nameDelivery = query.deliveryName;
                    query_['deliveryId'] = { $ne: null };
                }
            }
            if (company)
                query_['uid'] = mongoose_1.default.Types.ObjectId(company);
            findDocuments(Orders_1.default, query_, "", {}, '', 0, null, null).then((result) => {
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
                    let filterOrders = newOrders.filter((orders) => {
                        if (namePicker && nameDelivery) {
                            if (namePicker) {
                                if (orders.pickerId.name.toLowerCase().indexOf(namePicker.toLowerCase()) !== -1)
                                    return orders;
                            }
                            if (nameDelivery) {
                                if (orders.deliveryId.name.toLowerCase().indexOf(nameDelivery.toLowerCase()) !== -1)
                                    return orders;
                            }
                        }
                        else {
                            return orders;
                        }
                    });
                    response.json({
                        message: 'Listado de ordenes home',
                        data: filterOrders,
                        success: true,
                        orders: result.length
                    });
                }
                else {
                    response.json({
                        message: 'Listado de ordenes home',
                        data: result,
                        success: true,
                        orders: result.length
                    });
                }
            }).catch((err) => {
                response.json({
                    message: err,
                    success: false,
                    data: []
                });
            });
        }
        catch (error) {
            response.json({
                message: error,
                success: false,
                data: []
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
                        let update = { "pickerId": null, startPickingDate: null, state: mongoose_1.default.Types.ObjectId(stateId), shopId: null };
                        findOneAndUpdateDB(Orders_1.default, query, update, null, null).then((update) => {
                            if (update) {
                                let historyObj = {
                                    state: mongoose_1.default.Types.ObjectId(stateId),
                                    orderNumber: update.orderNumber,
                                    order: mongoose_1.default.Types.ObjectId(update._id),
                                    bag: null,
                                    shop: null,
                                    picker: null,
                                    delivery: null,
                                    orderSnapShot: update,
                                    dateHistory: new Date()
                                };
                                insertDB(History_1.default, historyObj).then((result) => {
                                    if (result) {
                                        response.json({
                                            message: 'Orden dejada',
                                            data: update,
                                            success: true
                                        });
                                    }
                                    else {
                                        response.json({
                                            message: 'Error al Tomar la orden',
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
                    const { id, pickerId, shopId } = request.body;
                    if (id) {
                        let query = { "_id": mongoose_1.default.Types.ObjectId(id) };
                        let update = { "pickerId": mongoose_1.default.Types.ObjectId(pickerId), startPickingDate: new Date(), state: mongoose_1.default.Types.ObjectId(stateId), shopId: mongoose_1.default.Types.ObjectId(shopId) };
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
                                            let historyObj = {
                                                state: mongoose_1.default.Types.ObjectId(stateId),
                                                orderNumber: update.orderNumber,
                                                order: mongoose_1.default.Types.ObjectId(update._id),
                                                bag: null,
                                                shop: null,
                                                picker: mongoose_1.default.Types.ObjectId(pickerId),
                                                delivery: null,
                                                orderSnapShot: update,
                                                dateHistory: new Date()
                                            };
                                            insertDB(History_1.default, historyObj).then((result) => {
                                                if (result) {
                                                    response.json({
                                                        message: 'Orden Tomada',
                                                        data: update,
                                                        success: true
                                                    });
                                                }
                                                else {
                                                    response.json({
                                                        message: 'Error al Tomar la orden',
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
                                        else {
                                            response.json({
                                                message: "Error al tomar la orden",
                                                success: false
                                            });
                                        }
                                    }).catch((err) => {
                                        response.json({
                                            message: err.message,
                                            success: false
                                        });
                                    });
                                }
                            }
                            else {
                                response.json({
                                    message: "Error al tomar laa orden",
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
                            let stateDesc = findResult[0].desc;
                            let _orders = [];
                            let history = [];
                            let orderNumbers = [];
                            let companyUID;
                            let ordersProcedure = [];
                            let ordersShop = [];
                            let findService;
                            orders.map((order, index) => {
                                // Aqui la logica para determinar la mejor hora de despacho
                                let deliveryDate = new Date();
                                deliveryDate.setHours(new Date(order.date).getHours() + Math.floor(Math.random() * 6) + 1);
                                // Fin logica para generar hora 
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
                                let historyObj = {
                                    state: mongoose_1.default.Types.ObjectId(stateId),
                                    orderNumber: order.orderNumber,
                                    order: null,
                                    bag: null,
                                    shop: null,
                                    picker: null,
                                    delivery: null,
                                    orderSnapShot: null,
                                    dateHistory: new Date()
                                };
                                orderNumbers.push(order.orderNumber);
                                companyUID = mongoose_1.default.Types.ObjectId(request.body.uid);
                                history.push(historyObj);
                                _orders.push(_order);
                            });
                            findDocuments(Orders_1.default, { 'uid': companyUID, orderNumber: { '$in': orderNumbers } }, "", {}, '', '', 0, null, null).then((OrdersFind) => {
                                let orderfinalToInsert = _orders.filter((order) => !OrdersFind.some((fillOrder) => order.orderNumber == fillOrder.orderNumber)); //filtramos ordenes para agregar, aqui obtenemos las ordenes a insertar
                                let orderfinalNotInsert = _orders.filter((order) => OrdersFind.some((fillOrder) => order.orderNumber == fillOrder.orderNumber)); //filtramos ordenes para agregar, aqui obtenemos las ordenes que no vamos a insertar
                                let historyToInsert = history.filter((history) => !OrdersFind.some((orders) => history.orderNumber == orders.orderNumber));
                                if (orderfinalToInsert.length) {
                                    insertManyDB(Orders_1.default, orderfinalToInsert).then((result) => {
                                        findDocuments(Company_1.default, { _id: companyUID }, "", {}, '', '', 0, null, null).then((CompanyResult) => {
                                            if (CompanyResult.length > 0) {
                                                result.map((order) => {
                                                    history.map((history) => {
                                                        if (order.orderNumber == history.orderNumber) {
                                                            history.order = mongoose_1.default.Types.ObjectId(order._id);
                                                            history.orderSnapShot = Object.assign({}, order.toJSON());
                                                        }
                                                    });
                                                    let serviceDesc = "";
                                                    let companyName = CompanyResult[0].name;
                                                    ServicesResult.map((service) => { if (service._id == order.service)
                                                        serviceDesc = service.desc; });
                                                    let param = {
                                                        "CuentaCliente": companyName,
                                                        "OrderTrabajo": order.orderNumber,
                                                        "NLocal": "",
                                                        "Local_Longitud": "-77.00000",
                                                        "Local_Latitud": "-33.77777",
                                                        "FecAgendada": order.realdatedelivery,
                                                        "UnSolicitadas": 5,
                                                        "Supervisor": "",
                                                        "RUT_Cliente": order.client.rut,
                                                        "Comuna_Cliente": order.client.comuna,
                                                        "Region_Cliente": order.client.ciudad,
                                                        "Longitud": "-77.00000",
                                                        "Latitud": "-77.00000",
                                                        "Estado": stateDesc,
                                                        "EsReagendamiento": 0,
                                                        "CanalVenta": order.channel,
                                                        "TipoDespacho": serviceDesc,
                                                    };
                                                    let paramShop = {
                                                        "CuentaCliente": companyName,
                                                        "OrderTrabajo": order.orderNumber,
                                                        "NLocal": "",
                                                        "Local_Longitud": "-77.00000",
                                                        "Local_Latitud": "-33.77777"
                                                    };
                                                    ordersShop.push(paramShop);
                                                    ordersProcedure.push(param);
                                                });
                                                insertManyDB(History_1.default, historyToInsert).then((resultHistory) => {
                                                    if (resultHistory) {
                                                        let promisesOrders = ordersProcedure.map((order) => { return executeProcedure("[OMS].[IngresoOrder]", order); });
                                                        Promise.all(promisesOrders).then((resultPromises) => {
                                                            if (resultPromises) {
                                                                let promisesOrdersShop = ordersShop.map((order) => { return executeProcedure("[OMS].[InfoLocal]", order); });
                                                                Promise.all(promisesOrdersShop).then((resultPromises) => {
                                                                    if (resultPromises) {
                                                                        response.json({
                                                                            message: 'orden(es) creada(s) exitosamente',
                                                                            ordersNotInsert: orderfinalToInsert,
                                                                            data: resultHistory,
                                                                            success: true
                                                                        });
                                                                    }
                                                                    else {
                                                                        response.json({ message: "Error al ingresar las ordenes, Ha ocurrido un error al ejecutar el procedimiento [OMS].[InfoLocal]", success: false });
                                                                    }
                                                                }).catch((err) => { response.json({ message: err, success: false, aqi: "Dsada" }); });
                                                            }
                                                            else {
                                                                response.json({ message: "Error al ingresar las ordenes, Ha ocurrido un error al ejecutar el procedimiento [OMS].[IngresoOrder]", success: false });
                                                            }
                                                        }).catch((err) => { response.json({ message: err, success: false, aqi: "Dsada" }); });
                                                    }
                                                    else {
                                                        response.json({ message: "Error al ingresar las ordenes, Ha ocurrido algun error", success: false, resultHistory: resultHistory });
                                                    }
                                                }).catch((err) => { response.json({ message: err, success: false, aqi: "Dsdsada" }); });
                                            }
                                            else {
                                                response.json({ message: "Error al ingresar las ordenes, no se ha encontrado un estado valido", success: false });
                                            }
                                        }).catch((err) => { response.json({ message: err, success: false }); });
                                    }).catch((err) => { response.json({ message: err, success: false }); });
                                }
                                else {
                                    response.json({
                                        message: "Las ordenes que intentas agregar ya existen en el sistema",
                                        ordersInsert: orderfinalToInsert,
                                        ordersInsertCount: orderfinalToInsert.length,
                                        ordersRepeat: orderfinalNotInsert,
                                        ordersRepeatCount: orderfinalNotInsert.length,
                                        code: 'xxx',
                                        success: false
                                    });
                                }
                            }).catch((err) => { response.json({ message: err.message, success: false }); });
                        }
                        else {
                            response.json({ message: "Error al ingresar las ordenes, no se ha encontrado un estado valido", success: false });
                        }
                    }).catch((err) => { response.json({ message: err.message, success: false }); });
                }
                else {
                    response.json({ message: "Error al ingresar las ordenes, no se ha encontrado un servicio valido", success: false });
                }
            }).catch((err) => { response.json({ message: err.message, success: false }); });
        }
        catch (error) {
            response.json({ message: error.message, success: false });
        }
    }
    async ordersToDelivery(request, response, next, app) {
        response.json({
            message: 'Listado de ordenes',
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
