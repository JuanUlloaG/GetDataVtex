"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
// import { User } from "../entity/User";
const mock_json_1 = __importDefault(require("../mock.json"));
class UserController {
    // private userRepository = getRepository(User);
    all(request, response, next, app) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(mock_json_1.default);
            response.json({
                mensaje: 'Listado de ordenes',
                data: mock_json_1.default,
                success: true
            });
        });
    }
    one(request, response, next, app) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    save(request, response, next, app) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    remove(request, response, next, app) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    auth(request, response, next, app) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = {
                check: true
            };
            let profile = 3;
            switch (request.body.usuario.charAt(0)) {
                case "1":
                    profile = 2;
                    break;
                case "2":
                    profile = 3;
                    break;
                case "3":
                    profile = 4;
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
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map