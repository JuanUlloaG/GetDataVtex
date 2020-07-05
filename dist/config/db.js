"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { mongo } = require("./config");
module.exports = {
    initDB: function (res, req) {
        return new Promise(function (resolve, reject) {
            try {
                mongoose_1.default.connect(mongo.conectionString, { useUnifiedTopology: true, connectTimeoutMS: 10000, useNewUrlParser: true }, (err) => {
                    if (err) {
                        reject(err.message);
                    }
                    else {
                        let cont = 0;
                        mongoose_1.default.connection.db.listCollections().toArray((error, collections) => {
                            if (error)
                                reject(error.message);
                            if (collections) {
                                collections.forEach((collection, index) => {
                                });
                                resolve();
                            }
                        });
                    }
                });
            }
            catch (error) {
                console.log(error.message);
            }
        });
    },
    insertDB: function (form, obj) {
        return new Promise(function (resolve, reject) {
            const newObj = new form(obj);
            newObj
                .save(function (err, document) {
                if (err)
                    reject(err.message);
                else {
                    resolve(document);
                }
            });
        });
    },
};
