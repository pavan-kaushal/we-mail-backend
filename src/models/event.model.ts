import {Model , model, Document, Schema, Types} from 'mongoose';
import { IRecipient } from './recipient.model';
import { IEmailIdentity } from './email-identity.model';

export interface IEvent extends Document {
    user: Types.ObjectId,
    name : string,
    emailIdentity: Types.ObjectId | IEmailIdentity
    description : string,
    recipients : Types.ObjectId[] | IRecipient[],
    attributes: string[],
    apiKey: string,
}

const eventSchema = new Schema({
    user:{ type:Schema.Types.ObjectId, required:true, ref: 'User'},
    name:{ type:Schema.Types.String, required:true, trim:true},
    emailIdentity:{ type:Schema.Types.ObjectId, required:true, ref: 'EmailIdentity'},
    description:{ type:Schema.Types.String, required:true, trim:true},
    recipients: [{type: Schema.Types.ObjectId, ref: 'Recipient'}],
    attributes: [{type: Schema.Types.String, trim: true}],
    apiKey: [{type: Schema.Types.String, trim: true}],
},{
    timestamps: true,
    versionKey: false
})

eventSchema.index({user:1});
eventSchema.index({user:1, recipients: 1});

export const Event: Model<IEvent> = model<IEvent>('Event',eventSchema);