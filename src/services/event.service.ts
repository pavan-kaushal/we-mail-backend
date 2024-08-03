import { Types } from "mongoose";
import { Event } from "../models/event.model";
import { formatRegex } from "../utils/helper-functions";
import { Attribute, IAttribute } from "../models/attribute.model";
const crypto = require('crypto');

export const addEvent = async (user: Types.ObjectId, name: string, emailIdentity: Types.ObjectId, description: string) => {
    const existingEventDoc = await Event.findOne({
        user: user,
        name: {
            $regex: formatRegex(name)
        }
    })
    if(existingEventDoc){
        throw Error("Event With Name Exists")
    }
    const randomBytes = crypto.randomBytes(8); 
    const randomHexString = randomBytes.toString('hex');
    await Event.create({
        user: user,
        name: name,
        emailIdentity: emailIdentity,
        description: description,
        apiKey: randomHexString
    })
}

export const updateEventDetails = async (id: Types.ObjectId, user: Types.ObjectId, name: string, emailIdentity: Types.ObjectId, description: string) => {
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
    await Event.findByIdAndUpdate(id, {
        user: user,
        name: name,
        emailIdentity: emailIdentity,
        description: description,
    })
}

export const eventTemplate = async (id: Types.ObjectId) => {
    const event = await Event.findById(id).lean();
    const subject = await replaceIdsWithAttributes(id, event?.subject ?? '')
    const body = await replaceIdsWithAttributes(id, event?.body ?? '')
    return { subject, body }
}

export const updateEventTemplate = async (id: Types.ObjectId, subject: string, body: string) => {
    subject = await replaceAttributesWithIds(id, subject);
    body = await replaceAttributesWithIds(id, body);
    await Event.findByIdAndUpdate(id, {
        subject: subject,
        body: body
    })
}

const replaceIdsWithAttributes = async (eventId: Types.ObjectId, template: string) => {
    const pattern = /{{[a-z0-9]+}}/g
    const matches = template.match(pattern);
    if(!matches?.length){
        return template;
    }
    const attributes = await Attribute.find({event: eventId}).lean();
    const attributesMap: {[key: string]: IAttribute} = {};
    for(let attribute of attributes){
        attributesMap[attribute._id.toString()] = attribute
    }
    const matchedIdsInTemplate = matches??[]
    const output = template.replace(new RegExp(matchedIdsInTemplate.join('|'), 'g'), (match) => `{{${attributesMap[match.slice(2,-2)].name}}}`)
    return output;
}

const replaceAttributesWithIds = async (eventId: Types.ObjectId, template: string) => {
    const pattern = /{{[a-zA-Z0-9_]+}}/g
    const matches = template.match(pattern);
    if(!matches?.length){
        return template;
    }
    const attributes = await Attribute.find({event: eventId}).lean();
    const attributesMap: {[key: string]: IAttribute} = {};
    for(let attribute of attributes){
        attributesMap[attribute.name] = attribute
    }
    const attributeNamesOfEvent = new Set(Object.keys(attributesMap))
    const matchedAttributeNamesInTemplate = (matches??[]).map(match => match.slice(2, -2));
    const invalidAttributeNames = matchedAttributeNamesInTemplate.filter(name => !attributeNamesOfEvent.has(name))
    if(invalidAttributeNames?.length){
        throw Error(`Invalid Attributes : ${invalidAttributeNames.join(', ')}`)
    }
    const validAttributeNames = matchedAttributeNamesInTemplate.filter(name => attributeNamesOfEvent.has(name));
    const output = template.replace(new RegExp(validAttributeNames.map(name => `{{${name}}}`).join('|'), 'g'), (match) =>  `{{${attributesMap[match.slice(2, -2)]._id.toString()}}}`)
    return output;
}

export const deleteEvent = async (id: Types.ObjectId) => {
    await Event.findByIdAndDelete(id)
    //event delete conditions
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