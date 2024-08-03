import {Model , model, Document, Schema, Types} from 'mongoose';
import { IRecipient } from './recipient.model';
import { IEmailIdentity } from './email-identity.model';
import { IUser } from './user.model';

export interface IEvent extends Document {
    user: Types.ObjectId | IUser,
    name : string,
    emailIdentity: Types.ObjectId | IEmailIdentity,
    description : string,
    recipients? : Types.ObjectId[] | IRecipient[],
    apiKey: string,
    subject?: string,
    body?: string,
}

const eventSchema = new Schema({
    user:{ type:Schema.Types.ObjectId, required:true, ref: 'User'},
    name:{ type:Schema.Types.String, required:true, trim:true},
    emailIdentity:{ type:Schema.Types.ObjectId, required:true, ref: 'EmailIdentity'},
    description:{ type:Schema.Types.String, required:true, trim:true},
    recipients: [{type: Schema.Types.ObjectId, ref: 'Recipient'}],
    apiKey: {type: Schema.Types.String, trim: true},
    subject:{ type:Schema.Types.String, trim:true},
    body:{ type:Schema.Types.String, trim:true},
},{
    timestamps: true,
    versionKey: false
})

eventSchema.index({user:1});
eventSchema.index({user:1, recipients: 1});

export const Event: Model<IEvent> = model<IEvent>('Event',eventSchema);