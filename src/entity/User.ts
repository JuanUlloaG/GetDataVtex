import mongoose, { Schema, Document } from "mongoose";

export interface BookInterface extends Document {
    name: string;
    rut: string;
    password: string;
}

const BookSchema: Schema = new Schema({
    password: { type: String, required: true },
    rut: { type: String, required: true },
    name: { type: String, required: true }
});

const User = mongoose.model<BookInterface>("User", BookSchema);
export default User;