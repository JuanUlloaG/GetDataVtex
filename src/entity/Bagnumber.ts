import mongoose, { Schema, Document } from "mongoose";

export interface BagNumberInterface extends Document {
    number: string;
    name: string;
}

const BagSchema: Schema = new Schema({
    number: { type: String, required: true },
    name: { type: String, required: false, default: 0 },
});

const Bag = mongoose.model<BagNumberInterface>("Bag", BagSchema, "bag");
export default Bag;