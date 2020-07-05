import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
// import { User } from "../entity/User";
import data from "../mock.json";




export class UserController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    console.log(data)
    response.json({
      mensaje: 'Listado de ordenes',
      data: data,
      success: true
    });
  }

  async one(request: Request, response: Response, next: NextFunction, app: any) {
    return null
  }

  async save(request: Request, response: Response, next: NextFunction, app: any) {
    return null
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