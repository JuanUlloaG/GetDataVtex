import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MongoError } from "mongodb";
const { mongo, sqlConfig } = require("./config")
import Conect, { Connection, Request as TediusRequest, TYPES, ConnectionConfig } from "tedious";



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
                                // collections.forEach((collection: any, index: any) => {
                                //     console.log(collection.name)
                                // })
                                resolve(true)

                            }
                        })
                    }
                })
            } catch (error) {
                console.log(error.message)
            }
        })
    },
    conectionToSql: function (res: Response, req: Request) {
        return new Promise(function (resolve, reject) {
            try {
                var connection: any;
                connection = new Connection(sqlConfig);
                connection.on('connect', function (err: Error) {
                    if (err) {
                        reject(err.message)
                    } else {
                        console.log("Connected To Sql");
                        resolve(true)
                    }
                });
            } catch (error) {
                console.log(error.message)
            }
        })
    },
    executeStatement: function executeQuery() {

    },
    executeProcedure: function (procedureName: string, params: any) {
        return new Promise(function (resolve, reject) {
            var connection: any;
            connection = new Connection(sqlConfig);
            connection.connect(function (errConn: Error) {
                if (errConn) {
                    console.log(errConn.message)
                    connection.close();
                    reject(false)
                }
                var request = new TediusRequest(procedureName, function (err: Error) {
                    if (err) {
                        console.log(err.message);
                        reject(false)
                    }
                    connection.close();
                    resolve(true)
                });
                let Keys = Object.keys(params)
                Keys.map((key: any) => {
                    if (key == "FecAgendada" || key == "InicioPicking" || key == "FinPicking") {
                        request.addParameter(key, TYPES.DateTime, params[key])
                    } else if (key == "UnSolicitadas" || key == "EsReagendamiento") {
                        request.addParameter(key, TYPES.Int, params[key])
                    } else {
                        request.addParameter(key, TYPES.VarChar, params[key])
                    }
                })
                request.on('requestCompleted', function () {
                    connection.close();
                });
                connection.callProcedure(request);
            });
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
    insertManyDB: async function (form: any, obj: any) {
        return new Promise(function (resolve, reject) {
            form.insertMany(obj, function (err: any, docs: any) {
                if (err) {
                    reject(err.message)
                }
                else {
                    resolve(docs)
                }
            })
        })
    },
    findOneDB: async function (form: any, query: any, select: string, sort: any, populate: any, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            form
                .findById(query)
                .sort(sort)
                .select(select)
                .populate(populate)
                .exec(function (err: Error, document: Document) {
                    if (err) reject(err.message)
                    else {
                        resolve(document)
                    }
                })
        })
    },
    findDocuments: async function (form: any, query: any, select: string, sort: any, populate: string, fields: string, limit: number, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            form
                .find(query)
                .sort(sort)
                .select(select)
                .limit(limit)
                .populate(populate)
                .exec(function (err: Error, documents: Document) {
                    if (err) reject(err.message)
                    else {
                        resolve(documents)
                    }
                })
        })
    },
    findDocumentsOrdesPopulate: async function (form: any, query: any, select: string, sort: any, populate: object, fields: string, limit: number, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            console.log("populated", populate)
            form
                .find(query)
                .sort(sort)
                .select(select)
                .limit(limit)
                .populate(populate)
                .exec(function (err: Error, documents: Document) {
                    if (err) reject(err.message)
                    else {
                        resolve(documents)
                    }
                })
        })
    },
    findDocumentsMultiPopulate: async function (form: any, query: any, select: string, sort: any, populate: object, populate1: object, populate2: object, populate3: object, populate4: object, populate5: object, populate6: object, fields: string, limit: number, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            form
                .find(query)
                .sort(sort)
                .select(select)
                .limit(limit)
                .populate(populate)
                .populate(populate1)
                .populate(populate2)
                .populate(populate3)
                .populate(populate4)
                .populate(populate5)
                .populate(populate6)
                .exec(function (err: Error, documents: Document) {
                    if (err) reject(err.message)
                    else {
                        resolve(documents)
                    }
                })
        })
    },
    findOneAndUpdateDB: async function (form: any, query: any, update: any, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            try {
                form
                    .findOneAndUpdate(
                        query,
                        { $set: update },
                        { new: true }
                    )
                    .exec(function (err: Error, documents: any) {
                        if (err) reject(err.message)
                        else {
                            resolve(documents)
                        }
                    })
            }
            catch (err) {
                reject(err.message)
            }
        })
    },
    updateManyDB: async function (form: any, query: any, update: any, req: any, res: any) {
        return new Promise(function (resolve, reject) {
            form
                .updateMany(
                    query,
                    { $set: update },
                    { multi: true }
                )
                .exec(function (err: Error, documents: any) {
                    if (err) reject(err.message)
                    else {
                        resolve(documents)
                    }
                })
        })
    },
}

