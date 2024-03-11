import {Model , model, Document, Schema, Types} from 'mongoose';
import { IUser } from './user.model';

export enum EMAIL_IDENTITY_TYPES {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
}

export interface IEmailIdentity extends Document {
    user: Types.ObjectId | IUser,
    type: EMAIL_IDENTITY_TYPES,
    email: string,
}

const emailIdentitySchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true, ref:'User'},
    type: {type: Schema.Types.String, required: true, enum: Object.values(EMAIL_IDENTITY_TYPES) },
    email: {type: Schema.Types.String, required:true, trim:true},
},{
    timestamps: true,
    versionKey: false
})

emailIdentitySchema.index({email: 1},{unique: true});
emailIdentitySchema.index({user:1, type:1});

export const EmailIdentity : Model<IEmailIdentity> = model<IEmailIdentity>('EmailIdentity',emailIdentitySchema);