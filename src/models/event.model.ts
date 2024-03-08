import {Model , model, Document, Schema, Types} from 'mongoose';
import { IRecipient } from './recipient.model';

export interface IEvent extends Document {
    user: Types.ObjectId,
    name : string,
    description : string,
    recipients : Types.ObjectId[] | IRecipient[],
}

const eventSchema = new Schema({
    user:{ type:Schema.Types.ObjectId, required:true, ref: 'User'},
    name:{ type:Schema.Types.String, required:true, trim:true},
    description:{ type:Schema.Types.String, required:true, trim:true},
    recipients: [{type: Schema.Types.ObjectId, ref: 'Recipient'}]
},{
    timestamps: true,
    versionKey: false
})

eventSchema.index({user:1});
eventSchema.index({user:1, recipients: 1});

export const Event: Model<IEvent> = model<IEvent>('Event',eventSchema);