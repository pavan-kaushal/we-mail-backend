import { Types } from "mongoose"
import { Attribute } from "../models/attribute.model"
import { Event } from "../models/event.model"

export const addAttribute = async (eventId:Types.ObjectId, name: string, description: string) => {
    const existingDoc = await Attribute.findOne({
        event: eventId,
        name: {
            $regex: new RegExp(name.trim(), 'i')
        }
    }).lean()
    if(existingDoc){
        throw Error(`Attribute with name ${existingDoc.name} exists`)
    }
    await Attribute.create({
        event: eventId,
        name: name,
        description: description
    })
}

export const updateAttribute = async (id: Types.ObjectId, name: string, description: string) => {
    const existingDoc = await Attribute.findOne({
        name: {
            $regex: new RegExp(name.trim(), 'i')
        },
        _id: {$ne: id}
    }).lean()
    if(existingDoc){
        throw Error(`Attribute with name ${existingDoc.name} exists`)
    }
    await Attribute.findByIdAndUpdate(id, {
        name: name,
        description: description
    })
}

export const deleteAttribute = async (id: Types.ObjectId) => {
    const attribute = await Attribute.findById(id).lean();
    const event = await Event.findById(attribute?.event).lean();
    const key = `{{${id.toString()}}}`
    if((event?.subject ?? '').includes(key) || (event?.body ?? '').includes(key)){
        throw Error("Attribute is being used in the template")
    }
    //delete user data related to attribute
    await Attribute.findByIdAndDelete(id)
}

export const getEventAttributeData = async (eventId: Types.ObjectId) => {
    const event = await Event.findById(eventId).lean();
    const attributes = await Attribute.find({
        event: eventId
    }).sort({_id: 1}).lean();
    return attributes.map(doc => {
        return {
            ...doc,
            isInUse: (event?.body?.length && event.body.includes(`{{${doc._id.toString()}}}`))
                    || (event?.subject?.length && event.subject.includes(`{{${doc._id.toString()}}}`))
        }
    })
}