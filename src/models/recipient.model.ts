import {Model , model, Document, Schema, Types} from 'mongoose';

export interface IRecipient extends Document {
    user: Types.ObjectId,
    name : string,
    email : string,
}

const recipientSchema = new Schema({
    user:{ type:Schema.Types.ObjectId, required:true, ref: 'User'},
    name:{ type:Schema.Types.String, required:true, trim:true},
    email:{ type:Schema.Types.String, required:true, trim:true},
},{
    timestamps: true,
    versionKey: false
})

recipientSchema.index({email:1, password:1});

export const Recipient: Model<IRecipient> = model<IRecipient>('Recipient',recipientSchema);