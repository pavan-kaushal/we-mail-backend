import { Types } from "mongoose";
import { Event } from "../models/event.model";
import { formatRegex } from "../utils/helper-functions";

export const addEvent = async (user: Types.ObjectId, name: string, emailIdentity: Types.ObjectId, description: string, attributes: string) => {
    const existingEventDoc = await Event.findOne({
        user: user,
        name: {
            $regex: formatRegex(name)
        }
    })
    if(existingEventDoc){
        throw Error("Event With Name Exists")
    }
    await Event.create({
        user: user,
        name: name,
        emailIdentity: emailIdentity,
        description: description,
        attributes: attributes.split(',').map(item => item.trim())
    })
}

export const updateEventDetails = async (id: Types.ObjectId, user: Types.ObjectId, name: string, emailIdentity: Types.ObjectId, description: string, attributes: string) => {
    const existingEventDoc = await Event.findOne({
        user: user,
        name: {
            $regex: formatRegex(name)
        },
        _id: {$ne: id}
    })
    if(existingEventDoc){
        throw Error("Event With Name Exists")
    }
    //check if removed attribute is in event template
    await Event.findByIdAndUpdate(id, {
        user: user,
        name: name,
        emailIdentity: emailIdentity,
        description: description,
        attributes: attributes.split(',').map(item => item.trim())
    })
}

export const deleteEvent = async (id: Types.ObjectId) => {
    await Event.findByIdAndDelete(id)
}

export const updateEventRecipients = async (eventId: Types.ObjectId, userIds: Types.ObjectId[]) => {
    await Event.findByIdAndUpdate(eventId,{
        $set: {
            recipients: userIds
        }
    })
}

export const getEventsOfUser = async (userId: Types.ObjectId) => {
    return await Event.find({user: userId}).sort({_id: 1}).lean();
}

export const getEventDetails = async (id: Types.ObjectId) => {
    return await Event.findById(id).lean();
}