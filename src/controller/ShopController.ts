import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const jwt = require('jsonwebtoken');
import Shop from "../entity/Shop";
const { initDB, insertDB, insertManyDB, findDocuments } = require("../config/db")


export class ShopController {

    // private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction, app: any) {
        response.json({
            message: 'Listado de locales',
            data: [],
            success: true
        });

    }

    async localByUser(request: Request, response: Response, next: NextFunction, app: any) {
        try {
            const userCompany = request.body.userCompany
            console.log(userCompany)
            let query = {};
            if (userCompany) {
                query = {
                    'company': userCompany
                }
            }

            const select = 'id_ address number'

            findDocuments(Shop, query, select, {}, '', '', 0, null, null).then((result: any) => {
                response.json({
                    message: 'Listado de locales para el usuario',
                    data: result,
                    success: true
                });
            }).catch((err: Error) => {
                response.json({
                    message: 'error listando locales para el usuario',
                    data: [],
                    err: [],
                    success: true
                });
                console.log("error", err)
            });

        } catch (error) {
            response.json({
                message: 'error listando locales para el usuario',
                data: [],
                eror: error,
                success: true
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
        const { phone, address, company, number } = request.body
        let shop = { phone, address, company, number }
        insertDB(Shop, shop).then((result: any) => {
            response.json({
                message: 'Local creado exitosamente',
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