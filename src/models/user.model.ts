import {Model , model, Document, Schema} from 'mongoose';

export interface IUser extends Document {
    name : string,
    email : string,
    password: string,
}

const userSchema = new Schema({
    name:{ type:Schema.Types.String, required:true, trim:true},
    email:{ type:Schema.Types.String, required:true, trim:true},
    password: { type: Schema.Types.String, required:true, trim:true},
},{
    timestamps: true,
    versionKey: false
})

userSchema.index({email:1, password:1});

export const User : Model<IUser> = model<IUser>('User',userSchema);