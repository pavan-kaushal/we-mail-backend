import { Types } from "mongoose";
import { EmailIdentity } from "../models/email-identity.model";
import { User } from "../models/user.model";

export const getIdentitiesOfUser = async (id: Types.ObjectId, shouldBeVerfifed: boolean = false) => {
    const user = await User.findById(id).lean();
    const data = await EmailIdentity.find({
        user: id,
        ...(shouldBeVerfifed ? {isVerified: true} : {})
    }).lean()
    return data.map(doc => {
        return {
            ...doc,
            isPrimary: doc._id.toString()==user?.emailIdentity.toString()
        }
    })
}

export const addEmailIdentity = async (userId: Types.ObjectId, email: string) => {
    const existingEmailDoc = await EmailIdentity.findOne({
        email: email
    }).lean();
    if(existingEmailDoc){
        if(existingEmailDoc.user.toString()==userId.toString()){
            throw Error("Email already Added")
        } else {
            throw Error("Address is Already Taken")
        }
    }
    await EmailIdentity.create({
        user: userId,
        email: email,
        isVerified: true
    })
}

export const deleteEmailIdentity = async (id: Types.ObjectId) => {
    await EmailIdentity.findByIdAndDelete(id)
}