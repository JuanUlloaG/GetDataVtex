import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const { insertDB } = require("../config/db")
import Company from "../entity/Company";


export class CompanyControllers {

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
      Metodo para crear una compañia
      Recibe: 
        name: Nombre de la compañia
        rut: rut de la compañia
        email: correo electronico de la compañia
        phone: telefono de la compañia
        TBD
   */
    async save(request: Request, response: Response, next: NextFunction, app: any) {
        const { name, phone, email, rut } = request.body
        let _company = { name, rut, email, phone, }
        insertDB(Company, _company).then((result: any) => {
            response.json({
                mensaje: 'Creacion de compañia exitosa',
                data: result,
                success: true
            });
        }).catch((err: Error) => {
            response.json({
                mensaje: err.message,
                success: false
            });
        });

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