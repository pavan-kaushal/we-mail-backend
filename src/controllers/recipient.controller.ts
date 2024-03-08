import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { addRecipient, deleteRecipient, getRecipientsOfUser, updateRecipient } from "../services/recipients.service";
import { Types } from "mongoose";
import { decodeTokenFromHeaders } from "../utils/helper-functions";

@Controller('recipient')
export class RecipientController {
    @Post('')
    async updateRecipient(req: Request, res: Response){
        try {
            let {email, name, id} = req.body;
            if(!email || !name || !id) {
                throw Error("Invalid Request")
            }
            await updateRecipient(new Types.ObjectId(id as string),name,email);
            responseMiddleware(res,true,'',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('')
    async addRecipient(req: Request, res: Response){
        try {
            let {name, email} = req.body;
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!name || !email || !userData?._id) {
                throw Error("Invalid Request")
            }
            await addRecipient(new Types.ObjectId(userData?._id as string),name,email)
            responseMiddleware(res,true,'',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Delete(':id')
    async deleteRecipient(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id) {
                throw Error("Invalid Request")
            }
            await deleteRecipient(new Types.ObjectId(id as string))
            responseMiddleware(res,true,'',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('')
    async getRecipients(req: Request, res: Response){
        try {
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!userData?._id) {
                throw Error("Invalid Request")
            }
            const data = await getRecipientsOfUser(new Types.ObjectId(userData._id as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
