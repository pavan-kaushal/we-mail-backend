import {Model , model, Document, Schema, Types} from 'mongoose';
import { IEvent } from './event.model';

export interface IAttribute extends Document {
    event: Types.ObjectId | IEvent,
    name : string,
    description : string,
}

const attributeSchema = new Schema({
    event:{ type:Schema.Types.ObjectId, required:true, ref: 'Event'},
    name:{ type:Schema.Types.String, required:true, trim:true},
    description:{ type:Schema.Types.String, required:true, trim:true},
},{
    timestamps: true,
    versionKey: false
})

attributeSchema.index({event:1});

export const Attribute: Model<IAttribute> = model<IAttribute>('Attribute',attributeSchema);