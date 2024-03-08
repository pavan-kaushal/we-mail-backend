import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { Types } from "mongoose";
import { decodeTokenFromHeaders } from "../utils/helper-functions";
import { addEvent, deleteEvent, getEventsOfUser, updateEventDetails, updateEventRecipients } from "../services/event.service";

@Controller('event')
export class EventController {
    @Post('')
    async updateEventDetails(req: Request, res: Response){
        try {
            let {name, id, email, description, attributes} = req.body;
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!name || !id || !email || !description || !userData?._id || !attributes) {
                throw Error("Invalid Request")
            }
            id = new Types.ObjectId(id as string)
            await updateEventDetails(id, new Types.ObjectId(userData?._id as string), name, email, description, attributes)
            responseMiddleware(res,true,'',null)
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
            responseMiddleware(res,true,'',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('')
    async addEvent(req: Request, res: Response){
        try {
            let {name, email, description, attributes} = req.body;
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!name || !email || !description || !userData?._id || !attributes) {
                throw Error("Invalid Request")
            }
            await addEvent(new Types.ObjectId(userData?._id as string), name, email, description, attributes)
            responseMiddleware(res,true,'',null)
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
            responseMiddleware(res,true,'',null)
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
            const data = getEventsOfUser(new Types.ObjectId(userData._id as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
