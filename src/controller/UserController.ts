import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const { initDB, insertDB } = require("../config/db")
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
      const { name, phone, email, profile, rut, password } = request.body
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
          let _user = { name, rut, email, password: hashedPassword, phone, profile }
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

    

    const payload = {
      check: true
    };
    let profile = 3
    switch (request.body.usuario.charAt(0)) {
      case "1":
        profile = 2
        break;
      case "2":
        profile = 3
        break;
      case "3":
        profile = 4
        break;

      default:
        break;
    }

    const token = jwt.sign(payload, app.get('key'), {});
    response.json({
      mensaje: 'Autentication successfull',
      token: token,
      profile: profile
    });
    // try {
    //   admin.auth().getUser(request.body.uid).then((result: any) => {
    //     response.json({
    //       mensaje: 'Autentication successfull',
    //       token: token,
    //       uid: result.uid
    //     });
    //   }).catch((err: any) => {
    //     response.json({ mensaje: "Ha ocurrido algun error: " + err.message })
    //   });

    // } catch (error) {
    //   response.json({ mensaje: "Ha ocurrido algun error: " + error.message })
    // }
  }
}