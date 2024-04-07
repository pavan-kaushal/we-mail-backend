import { Controller, Middleware, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import multer from 'multer';

@Controller('user-data')
export class UserDataController {
    constructor(){
    }


    @Post('download')
    async login(req: Request, res: Response){
        try {
            const data = null;
            responseMiddleware(res,true,'Logged In',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Post('upload')
    @Middleware([multer().none()])
    async addUser(req: Request, res: Response){
        try {
            console.log(req)
            responseMiddleware(res,true,'Upload Successful',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
