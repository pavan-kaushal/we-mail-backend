import { Controller, Get, Post, Put } from "@overnightjs/core";
import { Request, Response } from "express";
import responseMiddleware from "../utils/response.middleware";
import { userSignin, userSignup } from "../services/auth.service";

@Controller('auth')
export class AuthController {
    @Post('signin')
    async login(req: Request, res: Response){
        try {
            let {email, password} = req.body;
            if(!email || !password) {
                throw Error("Invalid Request")
            }
            const data = await userSignin(email,password);
            responseMiddleware(res,true,'Logged In',data)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }

    @Put('signup')
    async addUser(req: Request, res: Response){
        try {
            let {name, email, password} = req.body;
            if(!name || !email || !password) {
                throw Error("Invalid Request")
            }
            await userSignup(name,email,password)
            responseMiddleware(res,true,'Signup Successfull',null)
        } catch (error: any) {
            responseMiddleware(res,false,error.message,error)
        }
    }
}
