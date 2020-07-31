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
                                    console.log(collection.name);
                                });
                                resolve(true);
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
    insertManyDB: async function (form, obj) {
        return new Promise(function (resolve, reject) {
            form.insertMany(obj, function (err, docs) {
                if (err) {
                    reject(err.message);
                }
                else {
                    resolve(docs);
                }
            });
        });
    },
    findOneDB: async function (form, query, select, sort, populate, req, res) {
        return new Promise(function (resolve, reject) {
            form
                .findById(query)
                .sort(sort)
                .select(select)
                .populate(populate)
                .exec(function (err, document) {
                if (err)
                    reject(err.message);
                else {
                    resolve(document);
                }
            });
        });
    },
    findDocuments: async function (form, query, select, sort, populate, fields, limit, req, res) {
        return new Promise(function (resolve, reject) {
            form
                .find(query)
                .sort(sort)
                .select(select)
                .limit(limit)
                .populate(populate)
                .exec(function (err, documents) {
                if (err)
                    reject(err.message);
                else {
                    resolve(documents);
                }
            });
        });
    },
    findOneAndUpdateDB: async function (form, query, update, req, res) {
        return new Promise(function (resolve, reject) {
            try {
                form
                    .findOneAndUpdate(query, { $set: update }, { new: true })
                    .exec(function (err, documents) {
                    if (err)
                        reject(err.message);
                    else {
                        resolve(documents);
                    }
                });
            }
            catch (err) {
                reject(err.message);
            }
        });
    },
    updateManyDB: async function (form, query, update, req, res) {
        return new Promise(function (resolve, reject) {
            form
                .updateMany(query, { $set: update }, { multi: true })
                .exec(function (err, documents) {
                if (err)
                    reject(err.message);
                else {
                    resolve(documents);
                }
            });
        });
    },
};
