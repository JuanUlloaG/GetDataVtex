import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Shop from "../entity/Shop";
const { initDB, insertDB, insertManyDB } = require("../config/db")


export class ShopController {

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
        const { phone, address, company, number } = request.body
        let shop = { phone, address, company, number }
        insertDB(Shop, shop).then((result: any) => {
            response.json({
                mensaje: 'Creacion de Local exitosa',
                data: result,
                success: true
            });
        }).catch((err: Error) => {
            console.log(err.message)
        });

    }

    async remove(request: Request, response: Response, next: NextFunction, app: any) {

    }

    async auth(request: Request, response: Response, next: NextFunction, app: any) {
    }
}