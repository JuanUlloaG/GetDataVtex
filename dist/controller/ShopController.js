"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopController = void 0;
const jwt = require('jsonwebtoken');
const Shop_1 = __importDefault(require("../entity/Shop"));
const { initDB, insertDB, insertManyDB, findDocuments } = require("../config/db");
class ShopController {
    // private userRepository = getRepository(User);
    async all(request, response, next, app) {
        response.json({
            message: 'Listado de locales',
            data: [],
            success: true
        });
    }
    async localByUser(request, response, next, app) {
        try {
            const userCompany = request.body.userCompany;
            let query = {};
            if (userCompany) {
                query = {
                    'company': userCompany
                };
            }
            const select = 'id_ address number';
            findDocuments(Shop_1.default, query, select, {}, '', '', 0, null, null).then((result) => {
                response.json({
                    message: 'Listado de locales para el usuario',
                    data: result,
                    success: true
                });
            }).catch((err) => {
                response.json({
                    message: 'error listando locales para el usuario',
                    data: [],
                    err: [],
                    success: true
                });
                console.log("error", err);
            });
        }
        catch (error) {
            response.json({
                message: 'error listando locales para el usuario',
                data: [],
                eror: error,
                success: true
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
        const { phone, address, company, number } = request.body;
        let shop = { phone, address, company, number };
        insertDB(Shop_1.default, shop).then((result) => {
            response.json({
                message: 'Local creado exitosamente',
                data: result,
                success: true
            });
        }).catch((err) => {
            console.log(err.message);
        });
    }
    async remove(request, response, next, app) {
    }
    async auth(request, response, next, app) {
    }
}
exports.ShopController = ShopController;
