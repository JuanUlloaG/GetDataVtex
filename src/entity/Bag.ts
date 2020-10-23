import mongoose, { Schema, Document } from "mongoose";
import { CompanyInterface } from "./Company";

export interface BagInterface extends Document {

}

const BagSchema: Schema = new Schema({
    bag: { type: Schema.Types.ObjectId, required: false, ref: "Company" },
    description: { type: Array, required: true }
});

const Bag = mongoose.model<BagInterface>("Bag", BagSchema, "bag");
export default Bag;