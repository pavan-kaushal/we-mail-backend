import {Model ,model, Document, Schema, Types} from 'mongoose';
import { IEmailIdentity } from './email-identity.model';

export interface IUser extends Document {
    name : string,
    emailIdentity: Types.ObjectId | IEmailIdentity
    password: string,
}

const userSchema = new Schema({
    name:{ type:Schema.Types.String, required:true, trim:true},
    emailIdentity: { type:Schema.Types.ObjectId, required:true, ref: 'EmailIdentity'},
    password: { type: Schema.Types.String, required:true, trim:true},
},{
    timestamps: true,
    versionKey: false
})

userSchema.index({email:1, password:1});

export const User : Model<IUser> = model<IUser>('User',userSchema);