import mongoose, { Schema, Document } from "mongoose";
import { CompanyInterface } from "./Company";

export interface UserInterface extends Document {
    name: string;
    rut: string;
    password: string;
    email: string,
    phone: string,
    profile: string,
    company?: CompanyInterface['_id']
}


/*
    Los perfiles que actualmente manejamos son 
    2: Picker
    4: Moto o Delivery
 */

const UserSchema: Schema = new Schema({
    password: { type: String, required: true },
    rut: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    profile: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, required: false, ref: "Companies" }
});

const User = mongoose.model<UserInterface>("User", UserSchema, "users");
export default User;