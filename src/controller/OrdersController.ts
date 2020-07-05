import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
// import { User } from "../entity/User";





export class OrdersController {

  // private userRepository = getRepository(User);

  async all(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });

  }
  async orders(request: Request, response: Response, next: NextFunction, app: any) {
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
    response.json({
      mensaje: 'orden actualizada correctamente',
      data: "s",
      success: true
    });
  }

  async ordersToDelivery(request: Request, response: Response, next: NextFunction, app: any) {
    response.json({
      mensaje: 'Listado de ordenes',
      data: [],
      success: true
    });
  }

  async remove(request: Request, response: Response, next: NextFunction, app: any) {

  }

  async auth(request: Request, response: Response, next: NextFunction, app: any) {
    // const payload = {
    //   check: true
    // };
    // const token = jwt.sign(payload, app.get('key'), {});
    // response.json({
    //   mensaje: 'Autentication successfull',
    //   token: token,
    //   perfil: "1"
    // });
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