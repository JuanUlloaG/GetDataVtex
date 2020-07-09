"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyControllers = void 0;
const jwt = require('jsonwebtoken');
const { insertDB } = require("../config/db");
const Company_1 = __importDefault(require("../entity/Company"));
class CompanyControllers {
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
      Metodo para crear una compañia
      Recibe:
        name: Nombre de la compañia
        rut: rut de la compañia
        email: correo electronico de la compañia
        phone: telefono de la compañia
        TBD
   */
    async save(request, response, next, app) {
        const { name, phone, email, rut } = request.body;
        let _company = { name, rut, email, phone, };
        console.log("holas");
        insertDB(Company_1.default, _company).then((result) => {
            response.json({
                mensaje: 'Creacion de compañia exitosa',
                data: result,
                success: true
            });
        }).catch((err) => {
            response.json({
                mensaje: err.message,
                success: false
            });
        });
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
exports.CompanyControllers = CompanyControllers;
