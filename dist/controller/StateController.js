"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateControllers = void 0;
const jwt = require('jsonwebtoken');
const { insertDB, insertManyDB, findDocuments } = require("../config/db");
const State_1 = __importDefault(require("../entity/State"));
const State_2 = require("../entity/State");
const ajv_1 = __importDefault(require("ajv"));
var ajv = new ajv_1.default({ allErrors: true });
try {
    var validate = ajv.compile(State_2.schemaState);
}
catch (error) {
    console.log("object", error);
}
class StateControllers {
    // private userRepository = getRepository(User);
    async findBy(request, response, next, app) {
        let queryState = { $or: [{ "key": 0 }, { "key": 2 }] };
        findDocuments(State_1.default, queryState, "", {}, '', '', 0, null, null).then((findResult) => {
            console.log(findResult);
            response.json({
                message: findResult,
                success: false
            });
        }).catch((err) => {
            response.json({
                message: err.message,
                success: false
            });
        });
    }
    async one(request, response, next, app) {
        return null;
    }
    async save(request, response, next, app) {
        const { states } = request.body;
        let statesToSave = [];
        let statesNotSave = [];
        states.map((state) => {
            let _state = state;
            let valid = validate(_state);
            if (valid) {
                statesToSave.push(_state);
            }
            else {
                statesNotSave.push(_state);
            }
        });
        if (statesToSave.length > 0) {
            insertManyDB(State_1.default, statesToSave).then((result) => {
                response.json({
                    message: 'Se crearon los estados de forma exitosa',
                    data: result,
                    stateNotSave: statesNotSave,
                    success: true
                });
            }).catch((err) => {
                response.json({
                    message: err.message,
                    success: false
                });
            });
        }
        else {
            response.json({
                message: "Los estados no cumplen con los requisitos",
                data: statesNotSave,
                success: false
            });
        }
    }
    async remove(request, response, next, app) {
    }
}
exports.StateControllers = StateControllers;
