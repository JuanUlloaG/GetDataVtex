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
                                    console.log(collection.name)
                                })
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

