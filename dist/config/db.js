"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { mongo, sqlConfig } = require("./config");
const tedious_1 = require("tedious");
var connection;
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
                                // collections.forEach((collection: any, index: any) => {
                                //     console.log(collection.name)
                                // })
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
    conectionToSql: function (res, req) {
        // return new Promise(function (resolve, reject) {
        //     try {
        //         connection = new Connection(sqlConfig);
        //         connection.on('connect', function (err: Error) {
        //             if (err) {
        //                 reject(err.message)
        //             } else {
        //                 console.log("Connected To Sql");
        //                 resolve(true)
        //             }
        //         });
        //     } catch (error) {
        //         console.log(error.message)
        //     }
        // })
    },
    executeStatement: function executeQuery() {
        // try {
        //     connection = new Connection(sqlConfig);
        //     connection.on('connect', function (err: Error) {
        //         if (err) {
        //         } else {
        //             console.log("Connected To Sql");
        //             var request = new TediusRequest("SELECT * from OMS.CosmoOrder", function (err) {
        //                 if (err) {
        //                     console.log(err);
        //                 }
        //             });
        //             var result = "";
        //             request.on('row', function (columns) {
        //                 columns.forEach(function (column) {
        //                     if (column.value === null) {
        //                         console.log('NULL');
        //                     } else {
        //                         result += column.value + " ";
        //                     }
        //                 });
        //                 result = "";
        //             });
        //             request.on('done', function (rowCount, more) {
        //                 console.log(rowCount + ' rows returned');
        //             });
        //             connection.execSql(request);
        //         }
        //     });
        // } catch (error) {
        //     console.log(error.message)
        // }
    },
    executeInsertProcedure: function () {
        connection = new tedious_1.Connection(sqlConfig);
        connection.on('connect', function (err) {
            if (err) {
            }
            else {
                var request = new tedious_1.Request("[OMS].[CosmoIngresoOrder]", function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                request.addParameter("OrdenTrabajo", tedious_1.TYPES.VarChar, "123456789666");
                connection.callProcedure(request);
                connection.close();
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
    findDocumentsOrdesPopulate: async function (form, query, select, sort, populate, fields, limit, req, res) {
        return new Promise(function (resolve, reject) {
            console.log("populated", populate);
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
    findDocumentsMultiPopulate: async function (form, query, select, sort, populate, populate1, populate2, populate3, populate4, populate5, populate6, fields, limit, req, res) {
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
