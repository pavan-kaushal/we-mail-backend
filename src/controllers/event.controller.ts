import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { Types } from "mongoose";
import { decodeTokenFromHeaders } from "../utils/helper-functions";
import { addEvent, deleteEvent, eventTemplate, getEventDetails, getEventsOfUser, updateEventDetails, updateEventRecipients, updateEventTemplate } from "../services/event.service";

@Controller('event')
export class EventController {
    @Post('')
    async updateEventDetails(req: Request, res: Response){
        try {
            let {name, _id, emailIdentity, description} = req.body;
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!name || !_id || !emailIdentity || !description || !userData?._id) {
                throw Error("Invalid Request")
            }
            _id = new Types.ObjectId(_id as string)
            await updateEventDetails(_id, new Types.ObjectId(userData?._id as string), name, new Types.ObjectId(emailIdentity as string), description)
            responseMiddleware(res,true,'Event Updated Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Post('recipients')
    async updateEventRecipients(req: Request, res: Response){
        try {
            let {event, users} = req.body;
            if(!event || !users) {
                throw Error("Invalid Request")
            }
            event = new Types.ObjectId(event as string)
            users = users.map((id: string) => new Types.ObjectId(id))
            await updateEventRecipients(event, users)
            responseMiddleware(res,true,'Recipients Updated Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('')
    async addEvent(req: Request, res: Response){
        try {
            let {name, emailIdentity, description} = req.body;
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!name || !emailIdentity || !description || !userData?._id) {
                throw Error("Invalid Request")
            }
            await addEvent(new Types.ObjectId(userData?._id as string), name, new Types.ObjectId(emailIdentity as string), description)
            responseMiddleware(res,true,'Event Added Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Delete(':id')
    async deleteEvent(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id) {
                throw Error("Invalid Request")
            }
            await deleteEvent(new Types.ObjectId(id))
            responseMiddleware(res,true,'Event Deleted Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('')
    async getUserEvents(req: Request, res: Response){
        try {
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!userData?._id) {
                throw Error("Invalid Request")
            }
            const data = await getEventsOfUser(new Types.ObjectId(userData._id as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('details/:id')
    async getEventDetails(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id){
                throw Error("Invalid Request")
            }
            const data = await getEventDetails(new Types.ObjectId(id as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('template/:id')
    async getEventTemplate(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id){
                throw Error("Invalid Request")
            }
            const data = await eventTemplate(new Types.ObjectId(id))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Post('template/:id')
    async updateEventTemplate(req: Request, res: Response){
        try {
            let {id} = req.params;
            let {subject, body} = req.body;
            if(!id || !(subject || body)){
                throw Error("Invalid Request")
            }
            const data = await updateEventTemplate(new Types.ObjectId(id), subject, body)
            responseMiddleware(res,true,'Event Tempate Updated Successfully',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
