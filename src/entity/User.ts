import mongoose, { Schema, Document } from "mongoose";

export interface UserInterface extends Document {
    name: string;
    rut: string;
    password: string;
    email: string,
    phone: string,
    profile: string
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
    profile: { type: String, required: true }
});

const User = mongoose.model<UserInterface>("User", UserSchema);
export default User;