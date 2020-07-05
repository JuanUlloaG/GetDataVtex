import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MongoError } from "mongodb";
const { mongo } = require("./config")

module.exports = {
    initDB: function (res: Response, req: Request) {
        return new Promise(function (resolve, reject) {
            try {
                mongoose.connect(mongo.conectionString, { useUnifiedTopology: true, connectTimeoutMS: 10000, useNewUrlParser: true }, (err: MongoError) => {
                    if (err) {
                        reject(err.message)
                    } else {
                        let cont = 0;
                        mongoose.connection.db.listCollections().toArray((error: any, collections: any) => {
                            if (error) reject(error.message)
                            if (collections) {
                                collections.forEach((collection: any, index: any) => {
                                })
                                resolve()

                            }
                        })
                    }
                })
            } catch (error) {
                console.log(error.message)
            }
        })
    },
    insertDB: function (form: any, obj: any) {
        return new Promise(function (resolve, reject) {
            const newObj = new form(obj)
            newObj
                .save(function (err: Error, document: Document) {
                    if (err) reject(err.message)
                    else {
                        resolve(document)
                    }
                })
        })
    },
}

