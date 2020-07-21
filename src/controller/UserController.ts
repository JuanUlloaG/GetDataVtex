import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import mongoose from "mongoose";
const { initDB, insertDB, findOneDB, findDocuments, findOneAndUpdateDB } = require("../config/db");
import User from "../entity/User";
import bcrypt from "bcryptjs";





export class UserController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    // console.log(data)
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });
  }



  async one(request: Request, response: Response, next: NextFunction, app: any) {
    return null
  }

  async save(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const { name, phone, email, profile, rut, password, company } = request.body
      let hashedPassword
      if (!name || !phone || !email || !profile || !rut || !password) {
        response.json({
          mensaje: 'Error! al crear usuario',
          success: false
        });
      }

      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          hashedPassword = hash
          let _user;
          _user = { name, rut, email, password: hashedPassword, phone, profile, company: mongoose.Types.ObjectId(company), state: false }


          insertDB(User, _user).then((result: any) => {
            response.json({
              mensaje: 'Creacion de Usuario',
              data: result,
              success: true
            });
          }).catch((err: Error) => {
            response.json({
              mensaje: 'Error Creacion de Usuario',
              data: err,
              success: false
            });
            console.log(err)
          });
        });
      });


    } catch (error) {
      response.json({
        mensaje: 'Error! al crear usuario',
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

      findDocuments(User, query, "", {}, 'company', '', 0, null, null).then((result: any) => {
        console.log("object")
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
                  let company = { id: result[0].company._id, name: result[0].company.name }
                  response.json({
                    message: 'Autentication successfull',
                    token: token,
                    profile: update.profile,
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