import {Model , model, Document, Schema, Types} from 'mongoose';
import { IUser } from './user.model';

export interface IEmailIdentity extends Document {
    user: Types.ObjectId | IUser,
    email: string,
    isVerified: boolean,
}

const emailIdentitySchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User', default: null},
    email: {type: Schema.Types.String, required:true, trim:true},
    isVerified: {type: Schema.Types.Boolean, required:true, default: false},
},{
    timestamps: true,
    versionKey: false
})

emailIdentitySchema.index({email: 1},{unique: true});
emailIdentitySchema.index({user:1});

export const EmailIdentity : Model<IEmailIdentity> = model<IEmailIdentity>('EmailIdentity',emailIdentitySchema);