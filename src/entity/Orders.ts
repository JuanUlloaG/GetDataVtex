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
        ciudad: string,
        long: number,
        lat: number
    },
    date: Date,
    startPickingDate: Date,
    endPickingDate: Date,
    starDeliveryDate: Date,
    endDeliveryDate: Date,
    realdatedelivery: Date,
    pickerWorkShift: string
}
/*
    
 */

const OrderSchema: Schema = new Schema({
    uid: { type: Schema.Types.ObjectId, required: true, ref: "Companies" },
    orderNumber: { type: String, required: true },
    shopId: { type: Schema.Types.ObjectId, required: false, ref: "Shops", default: null },
    pickerId: { type: Schema.Types.ObjectId, required: false, ref: "Users", default: null },
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
        location: { type: Number, required: true },
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
    date: { type: Date, required: true },
    startPickingDate: { type: Date, required: true },
    endPickingDate: { type: Date, required: true },
    starDeliveryDate: { type: Date, required: true },
    endDeliveryDate: { type: Date, required: true },
    realdatedelivery: { type: Date, required: true },
    pickerWorkShift: { type: String, required: true }
});

const Order = mongoose.model<OrderInterface>("Order", OrderSchema);
export default Order;