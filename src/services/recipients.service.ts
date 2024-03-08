import { Types } from "mongoose";
import { Recipient } from "../models/recipient.model";

const validateEmail = (email: string) => {
    const isValid = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$").test(email);
    if(!isValid){
        throw Error("Invalid Email");
    }
}

export const addRecipient = async (user: Types.ObjectId, name: string, email: string) => {
    email = email.trim()
    validateEmail(email);
    const existingRecipientDoc = await Recipient.findOne({
        user: user,
        email: email
    })
    if(existingRecipientDoc){
        throw Error(`User with ${email} exists`)
    }
    await Recipient.create({
        user: user,
        name: name,
        email: email
    })
}

export const updateRecipient = async (id: Types.ObjectId, name: string, email: string) => {
    const recipientDoc = await Recipient.findById(id).lean();
    email = email.trim()
    validateEmail(email);
    if(recipientDoc?.email!=email){
        const existingRecipientDoc = await Recipient.find({
            user: recipientDoc?.user,
            email: email,
            _id: {$ne: id}
        })
        if(existingRecipientDoc){
            throw Error(`User with ${email} exists`)
        }
    }
    await Recipient.findByIdAndUpdate(id,{
        $set:{ name, email }
    })
}

export const deleteRecipient = async (id: Types.ObjectId) => {
    await Recipient.findByIdAndDelete(id)
}

export const getRecipientsOfUser = async (user: Types.ObjectId) => {
    return await Recipient.find({user}).sort({_id: 1}).lean()
}