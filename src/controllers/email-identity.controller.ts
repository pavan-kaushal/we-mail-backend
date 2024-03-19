import { Controller, Delete, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { decodeTokenFromHeaders } from "../utils/helper-functions";
import { Types } from "mongoose";
import { addEmailIdentity, deleteEmailIdentity, getIdentitiesOfUser } from "../services/email-identity.service";

@Controller('email-identity')
export class EmailIdentityController {
    @Get('')
    async identitiesOfUser(req: Request, res: Response){
        try {
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!userData?._id){
                throw Error("Invalid Request")
            }
            const data = await getIdentitiesOfUser(new Types.ObjectId(userData._id as string))
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Get('verified')
    async verifiedIdentitiesOfUser(req: Request, res: Response){
        try {
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            if(!userData?._id){
                throw Error("Invalid Request")
            }
            const data = await getIdentitiesOfUser(new Types.ObjectId(userData._id as string), true)
            responseMiddleware(res,true,'',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('')
    async addEmailIdentity(req: Request, res: Response){
        try {
            const userData = decodeTokenFromHeaders(req.headers.authorization as string);
            const {email} = req.body;
            if(!userData?._id || !email){
                throw Error("Invalid Request")
            }
            await addEmailIdentity(new Types.ObjectId(userData._id as string), email)
            responseMiddleware(res,true,'Email Added Successfully',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Delete(':id')
    async deleteEmailIdentity(req: Request, res: Response){
        try {
            let {id} = req.params;
            if(!id) {
                throw Error("Invalid Request")
            }
            await deleteEmailIdentity(new Types.ObjectId(id as string))
            responseMiddleware(res,true,'Email Deleted',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
