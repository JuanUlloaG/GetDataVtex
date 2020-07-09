import mongoose, { Schema, Document } from "mongoose";

export interface CompanyInterface extends Document {
    name: string;
    rut: string;
    email: string,
    phone: string
}


/*
    Los perfiles que actualmente manejamos son 
    2: Picker
    4: Moto o Delivery
 */

const CompanySchema: Schema = new Schema({
    rut: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
});

const Company = mongoose.model<CompanyInterface>("Company", CompanySchema, "companies");
export default Company;