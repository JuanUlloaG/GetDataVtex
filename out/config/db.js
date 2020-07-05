"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose").set("debug", true);
const { mongo } = require("./config");
module.exports = {
    initDB: function (res, req) {
        console.log("dada");
        return new Promise(function (resolve, reject) {
            try {
                console.log(mongo.conectionString);
                mongoose.connect(mongo.conectionString, { useNewUrlParser: true, connectTimeoutMS: 10000 }, (err, db) => {
                    if (err) {
                        console.log(err.message);
                        reject(err.message);
                    }
                    else {
                        let cont = 0;
                        mongoose.connection.db.listCollections().toArray((error, collections) => {
                            if (error)
                                reject(error.message);
                            if (collections) {
                                collections.forEach((collection, index) => {
                                    console.log("Colection:", collection);
                                    resolve(db);
                                });
                            }
                        });
                    }
                });
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
};
//# sourceMappingURL=db.js.map