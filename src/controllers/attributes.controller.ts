import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { Types } from "mongoose";
import { addAttribute, deleteAttribute, getEventAttributeData, updateAttribute } from "../services/attributes.service";

@Controller('attribute')
export class AttributeController {
    @Post('')
    async updateAttribute(req: Request, res: Response){
        try {
            let {name, id, description} = req.body;
            if(!name || !id || !description) {
                throw Error("Invalid Request")
            }
            id = new Types.ObjectId(id as string)
            await updateAttribute(new Types.ObjectId(id as string),name,description)
            responseMiddleware(res,true,'Attribute Updated Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('')
    async addAttribute(req: Request, res: Response){
        try {
            let {name, eventId, description} = req.body;
            if(!name || !eventId || !description) {
                throw Error("Invalid Request")
            }
            await addAttribute(new Types.ObjectId(eventId as string),name,description)
            responseMiddleware(res,true,'Attribute Added Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Delete(':id')
    async deleteAttribute(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id) {
                throw Error("Invalid Request")
            }
            await deleteAttribute(new Types.ObjectId(id))
            responseMiddleware(res,true,'Attribute Deleted Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('')
    async getEventAttributeData(req: Request, res: Response){
        try {
            const {eventId} = req.query;
            if(!eventId){
                throw Error("Invalid Request")
            }
            const data = await getEventAttributeData(new Types.ObjectId(eventId as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
