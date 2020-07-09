import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
import mongoose from "mongoose";
const { initDB, insertDB, findOneDB, findDocuments } = require("../config/db");
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
          if (company) {
            _user = { name, rut, email, password: hashedPassword, phone, profile, company: mongoose.Types.ObjectId(company) }
          } else {
            _user = { name, rut, email, password: hashedPassword, phone, profile }
          }
          insertDB(User, _user).then((result: any) => {
            response.json({
              mensaje: 'Creacion de Usuario',
              data: result,
              success: true
            });
          }).catch((err: Error) => {
            console.log(err.message)
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

  async remove(request: Request, response: Response, next: NextFunction, app: any) {

  }

  async auth(request: Request, response: Response, next: NextFunction, app: any) {
    try {
      const query = { 'rut': request.body.user }
      const payload = {
        check: true
      };

      findDocuments(User, query, "", {}, '', '', 0, null, null).then((result: any) => {
        if (result.length > 0) {
          let pass = result[0].password
          bcrypt.compare(request.body.password, pass, (err, match) => {
            if (err) {
              response.json({
                message: 'Error',
                success: false,
                code: err
              });
            }
            if (match) {
              const token = jwt.sign(payload, app.get('key'), {});
              response.json({
                message: 'Autentication successfull',
                token: token,
                profile: result[0].profile,
                company: result[0].company,
                name: result[0].name,
                email: result[0].email,
                id: result[0]._id,
                success: true
              });
            }
          })
        } else {
          response.json({
            message: 'Error usuario no encontrado',
            success: false
          });
        }
      })
    } catch (error) {
      response.json({
        message: error,
        success: false
      });
    }
  }




}