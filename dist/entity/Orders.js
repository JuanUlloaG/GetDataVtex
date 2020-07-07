"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
/*
    Los perfiles que actualmente manejamos son
    2: Picker
    4: Moto o Delivery
 */
const OrderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, required: true },
    shopId: { type: String, required: true },
    pickerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: "User" },
    products: [{
            id: { type: String, required: true },
            barcode: { type: String, required: true },
            product: { type: String, required: true },
            units: { type: Number, required: true },
            unitsPicked: { type: Number, required: true },
            unitsSubstitutes: { type: Number, required: true },
            unitsBroken: { type: Number, required: true },
            unitsReplaced: { type: Number, required: true },
            description: { type: String, required: true },
        }],
    client: {
        rut: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        comuna: { type: String, required: true },
        ciudad: { type: String, required: true },
        long: { type: String, required: true },
        lat: { type: String, required: true }
    },
    startPickingDate: { type: Date, required: true },
    endPickingDate: { type: Date, required: true },
    starDeliveryDate: { type: Date, required: true },
    endDeliveryDate: { type: Date, required: true },
    realdatedelivery: { type: Date, required: true },
    pickerWorkShift: { type: String, required: true }
});
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;