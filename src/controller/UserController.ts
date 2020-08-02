import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import mongoose from "mongoose";
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
import User from "../entity/User";
import bcrypt from "bcryptjs";
import State from "../entity/State";
mongoose.set('debug', true);



export class UserController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { company, query } = request.body
      let arrayQuery: Array<any> = []
      let _query: any;
      let query_: any = {}
      if (query) {
        if (query.profile) {
          arrayQuery.push({ 'profile': mongoose.Types.ObjectId(query.profile) })
        }
        if (query.company) {
          arrayQuery.push({ 'company': mongoose.Types.ObjectId(query.company) })
        }

        if (query.profile && query.company) {
          query_['$or'] = [...arrayQuery]
        } else {
          query_['$or'] = [...arrayQuery]
        }
      }


      let populate: string = '';
      let queryState = { "key": 10 }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        if (findResult.length > 0) {
          let stateId = findResult[0]._id;
          if (company) {
            if (query) {
              if (query.profile && query.company) {
                query_['$and'] = [{ "company": mongoose.Types.ObjectId(company) }, { "condition": { "$ne": mongoose.Types.ObjectId(stateId) } }]
              } else {
                query_['$and'] = [{ "company": mongoose.Types.ObjectId(company) }, { "condition": { "$ne": mongoose.Types.ObjectId(stateId) } }]
              }

            } else {
              query_ = {
                "company": mongoose.Types.ObjectId(company),
                "condition": { "$ne": mongoose.Types.ObjectId(stateId) }
              }
            }
          }
          else {
            if (query) {
              query_['$and'] = [{ "condition": { "$ne": mongoose.Types.ObjectId(stateId) } }]
            } else {
              query_ = {
                "condition": { "$ne": mongoose.Types.ObjectId(stateId) }
              }
            }

          }
          populate = 'profile company condition'


          findDocuments(User, query_, "", {}, populate, '', 0, null, null).then((result: any) => {
            response.json({
              message: 'Listado de usuarios',
              data: result,
              success: true
            });
          }).catch((err: Error) => {
            response.json({
              message: err,
              success: false
            });
          });
        } else {
          response.json({
            message: "Error al traer lista de usuaruios",
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err.message,
          success: false
        });
      })



    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }
  }

  async deleteUser(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id } = request.body
      let query: object;
      query = { '_id': mongoose.Types.ObjectId(id) }
      let queryState = { "key": 10 }
      findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
        if (findResult.length > 0) {
          let stateId = findResult[0]._id;
          let update = { 'condition': mongoose.Types.ObjectId(stateId) }
          findOneAndUpdateDB(User, query, update, null, null).then((result: any) => {
            if (result) {
              response.json({
                message: 'Usuario Actualizado correctamente',
                data: result,
                success: true
              });
            } else {
              response.json({
                message: "Error al actualizar usuario",
                success: false
              });
            }

          }).catch((err: Error) => {
            response.json({
              message: err,
              success: false
            });
          });
        } else {
          response.json({
            message: "Error al ingresar las ordenes, no se ha encontrado un estado valido",
            success: false
          });
        }


      }).catch((err: Error) => {

      })


    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }
  }

  async update(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { id, name, email, phone, profile } = request.body
      let update = { name, email, phone, profile }
      let query: object;
      query = { '_id': mongoose.Types.ObjectId(id) }
      findOneAndUpdateDB(User, query, update, null, null).then((result: any) => {
        if (result) {
          response.json({
            message: 'Usuario Actualizado correctamente',
            data: result,
            success: true
          });
        } else {
          response.json({
            message: "Error al actualizar usuario",
            success: false
          });
        }

      }).catch((err: Error) => {
        response.json({
          message: err,
          success: false
        });
      });

    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }
  }



  async one(request: Request, response: Response, next: NextFunction, app: any) {
    return null
  }

  async save(request: Request, response: Response, next: NextFunction, app: any) {
    try {

      const { name, phone, email, profile, rut, password, company } = request.body
      if (!name || !phone || !email || !profile || !rut || !password) {
        response.json({
          message: 'Error! al crear usuario',
          success: false
        });
      }
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          let hashedPassword: any
          hashedPassword = hash

          let queryState = { "key": 9 }
          findDocuments(State, queryState, "", {}, '', '', 0, null, null).then((findResult: Array<any>) => {
            let _user: any = {};
            if (findResult.length > 0) {
              let stateId = findResult[0]._id;
              _user = { name, rut, email, password: hashedPassword, phone, profile: mongoose.Types.ObjectId(profile), condition: mongoose.Types.ObjectId(stateId), state: false }
              if (company) {
                _user['company'] = mongoose.Types.ObjectId(company)
              }
              insertDB(User, _user).then((result: any) => {
                response.json({
                  message: 'Usuario ' + name + ' Creado exitosamente ',
                  data: result,
                  success: true
                });
              }).catch((err: Error) => {
                response.json({
                  message: err.message,
                  data: err,
                  success: false
                });
                console.log(err)
              });
            } else {
              response.json({
                message: 'Error Creacion de Usuario',
                success: false
              });
            }
          }).catch((err: Error) => {
            response.json({
              message: err.message,
              data: err,
              success: false
            });
          })

        });
      });


    } catch (error) {
      response.json({
        message: 'Error! al crear usuario',
        info: error.message,
        success: false
      });
    }


  }

  async active(request: Request, response: Response, next: NextFunction, app: any) {
    const { id, state } = request.body
    let query = { "_id": mongoose.Types.ObjectId(id) }
    let update = { "state": state }
    findOneAndUpdateDB(User, query, update, null, null).then((update: any) => {
      if (update) {
        response.json({
          message: 'Actualización de estado exitosa',
          state: update.state,
          success: true
        });
      } else {
        response.json({
          message: "Error al actualizar estado",
          success: false
        });
      }
    }).catch((err: Error) => {
      response.json({
        message: err,
        success: false
      });
    });

  }

  async inactive(request: Request, response: Response, next: NextFunction, app: any) {

  }

  async auth(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const query = { 'rut': request.body.user }
      const payload = {
        check: true
      };

      findDocuments(User, query, "", {}, 'company profile', '', 0, null, null).then((result: any) => {
        console.log(result)
        if (result.length > 0) {
          let pass = result[0].password
          bcrypt.compare(request.body.password, pass, (err, match) => {
            if (err) {
              response.json({
                message: err,
                success: false,
                code: err
              });
            }
            if (match) {
              let query = { "_id": mongoose.Types.ObjectId(result[0]._id) }
              let update = { "state": true }
              findOneAndUpdateDB(User, query, update, null, null).then((update: any) => {
                if (update) {
                  const token = jwt.sign(payload, app.get('key'), {});
                  let company: any = {}
                  if (result[0].company) {
                    company = { id: result[0].company._id, name: result[0].company.name }
                  } else {
                    company = { id: "", name: "N/A" }
                  }
                  response.json({
                    message: 'Autentication successfull',
                    token: token,
                    profile: result[0].profile,
                    company: company,
                    name: update.name,
                    email: update.email,
                    id: update._id,
                    state: update.state,
                    success: true
                  });
                } else {
                  response.json({
                    message: "Error al iniciar sesión",
                    success: false
                  });
                }
              }).catch((err: Error) => {
                response.json({
                  message: "error: " + err,
                  success: false
                });
              });

            } else {
              response.json({
                message: "Usuario o contraseña incorrecta",
                success: false,
                code: err
              });
            }
          })
        } else {
          response.json({
            message: 'Error usuario no encontrado',
            success: false
          });
        }
      }).catch((err: Error) => {
        response.json({
          message: err,
          success: false
        });
      })
    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }
  }




}