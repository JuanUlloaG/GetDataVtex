import mongoose, { Schema, Document } from "mongoose";
import { UserInterface } from "./User";
import { CompanyInterface } from "./Company";
import { ShopInterface } from "./Shop"
import { OrderInterface } from "./Orders"


export interface OrderBagsInterface extends Document {
    orderNumber: OrderInterface['_id'],
    shopId: ShopInterface['_id'],
    pickerId?: UserInterface['_id'],
    deliveryId?: UserInterface['_id'],
    readyforDelivery: boolean,
    delivery?: boolean,
    received?: string,
    comment?: string,
    bags: [
        {
            bagNumber: string,
            products: [
                {
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
                }
            ]
        }
    ]
}


/*
    
*/
export const schemaBags = {
    orderNumber: { type: "string" },
    shopId: { type: "string" },
    pickerId: { type: "string", required: "false" },
    deliveryId: { type: "string", required: "false" },
    readyforDelivery: { type: "boolean", required: "false" },
    received: { type: "string", required: "false" },
    delivery: { type: "boolean", required: "false" },
    comment: { type: "string", required: "false" },
    bags: [
        {
            bagNumber: { type: "string" },
            products: [
                {
                    id: { type: "string" },
                    barcode: { type: "string" },
                    product: { type: "string" },
                    units: { type: "number" },
                    unitsPicked: { type: "number" },
                    unitsSubstitutes: { type: "number" },
                    unitsBroken: { type: "number" },
                    unitsReplaced: { type: "number" },
                    description: { type: "string" },
                    image: { type: "string" },
                    location: { type: "number" },
                }
            ]
        }
    ]
}

const OrderBagsSchema: Schema = new Schema({
    orderNumber: { type: Schema.Types.ObjectId, required: true, ref: "Order", autopopulate: true },
    shopId: { type: Schema.Types.ObjectId, required: true, ref: "Shop", autopopulate: true },
    pickerId: { type: Schema.Types.ObjectId, required: false, ref: "User", default: null, autopopulate: true },
    deliveryId: { type: Schema.Types.ObjectId, required: false, ref: "User", default: null, autopopulate: true },
    readyforDelivery: { type: Boolean, required: false, default: false },
    delivery: { type: Boolean, required: false, default: false },
    received: { type: String, required: false, default: "" },
    comment: { type: String, required: false, default: "" },
    bags: [
        {
            bagNumber: { type: String, required: true },
            products: [
                {
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
                }
            ]
        }
    ]
});

const OrderBags = mongoose.model<OrderBagsInterface>("OrderBag", OrderBagsSchema, "orderbags");
export default OrderBags;