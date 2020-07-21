import mongoose, { Schema, Document } from "mongoose";
import { UserInterface } from "./User";
import { CompanyInterface } from "./Company";
import { ShopInterface } from "./Shop"
export interface OrderInterface extends Document {
    uid: CompanyInterface['_id'],
    orderNumber: number,
    shopId?: ShopInterface['_id'],
    pickerId: UserInterface['_id'],
    products: [{
        id: number,
        barcode: number,
        product: string,
        units: number,
        unitsPicked: number,
        unitsSubstitutes: number,
        unitsBroken: number,
        unitsReplaced: number,
        description: string,
        image: string,
        location: number
    }],
    client: {
        rut: string,
        name: string,
        address: string,
        comuna: string,
        comment: string,
        third: string,
        ciudad: string,
        long: number,
        lat: number
    },
    date: Date,
    startPickingDate?: Date,
    endPickingDate?: Date,
    starDeliveryDate?: Date,
    endDeliveryDate?: Date,
    realdatedelivery?: Date,
    pickerWorkShift: string,
    state: { key: string, description: string }
}
/*
    
 */

const OrderSchema: Schema = new Schema({
    uid: { type: Schema.Types.ObjectId, required: true, ref: "Company" },
    orderNumber: { type: String, required: true },
    shopId: { type: Schema.Types.ObjectId, required: false, ref: "Shop", default: null },
    pickerId: { type: Schema.Types.ObjectId, required: false, ref: "User", default: null },
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
        image: { type: String, required: true },
        location: { type: Number, required: true },
    }],
    client: {
        rut: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        third: { type: String, required: false, default: "" },
        comment: { type: String, required: false, default: "" },
        comuna: { type: String, required: true },
        ciudad: { type: String, required: true },
        long: { type: String, required: true },
        lat: { type: String, required: true }
    },
    date: { type: Date, required: true },
    startPickingDate: { type: Date, required: false, default: null },
    endPickingDate: { type: Date, required: false, default: null },
    starDeliveryDate: { type: Date, required: false, default: null },
    endDeliveryDate: { type: Date, required: false, default: null },
    realdatedelivery: { type: Date, required: false, default: null },
    pickerWorkShift: { type: String, required: true },
    state: { type: { key: String, description: String }, required: true },
});

const Order = mongoose.model<OrderInterface>("Order", OrderSchema, "orders");
export default Order;