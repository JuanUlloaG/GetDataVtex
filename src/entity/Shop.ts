import mongoose, { Schema, Document } from "mongoose";
import { CompanyInterface } from "./Company";

export interface ShopInterface extends Document {
    address: string;
    phone?: string;
    company: CompanyInterface['_id'];
    number?: number;
}


/*
    Los perfiles que actualmente manejamos son 
    2: Picker
    4: Moto o Delivery
 */

const ShopSchema: Schema = new Schema({
    number: { type: String, required: false },
    address: { type: String, required: true },
    phone: { type: String, required: false },
    company: { type: Schema.Types.ObjectId, required: true, ref: "Company" }
});

const Shop = mongoose.model<ShopInterface>("Shop", ShopSchema, "shops");
export default Shop;