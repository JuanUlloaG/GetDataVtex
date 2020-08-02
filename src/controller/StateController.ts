import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const { insertDB, insertManyDB, findDocuments } = require("../config/db")
import State from "../entity/State";
import { schemaState } from "../entity/State";
import Ajv from 'ajv';
import { ObjectId } from "mongodb";
var ajv = new Ajv({ allErrors: true });

try {
    var validate = ajv.compile(schemaState)
} catch (error) {
    console.log("object", error)
}


export class StateControllers {

    // private userRepository = getRepository(User);

    async findBy(request: Request, response: Response, next: NextFunction, app: any) {
        let queryState = { $or: [{ "key": 0 }, { "key": 2 }] }
        findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
            console.log(findResult)
            response.json({
                message: findResult,
                success: false
            });
        }).catch((err: Error) => {
            response.json({
                message: err.message,
                success: false
            });
        });

    }

    async one(request: Request, response: Response, next: NextFunction, app: any) {
        return null
    }

    async save(request: Request, response: Response, next: NextFunction, app: any) {
        const { states } = request.body
        let statesToSave: Array<{ key: string, desc: string }> = []
        let statesNotSave: Array<{ key: string, desc: string }> = []
        states.map((state: { key: string, desc: string }) => {
            let _state = state
            let valid = validate(_state)
            if (valid) {
                statesToSave.push(_state)
            } else {
                statesNotSave.push(_state)
            }
        })

        if (statesToSave.length > 0) {
            insertManyDB(State, statesToSave).then((result: any) => {
                response.json({
                    message: 'Se crearon los estados de forma exitosa',
                    data: result,
                    stateNotSave: statesNotSave,
                    success: true
                });
            }).catch((err: Error) => {
                response.json({
                    message: err.message,
                    success: false
                });
            });
        } else {
            response.json({
                message: "Los estados no cumplen con los requisitos",
                data: statesNotSave,
                success: false
            });
        }

    }

    async remove(request: Request, response: Response, next: NextFunction, app: any) {

    }
}