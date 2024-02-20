import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller('')
export class TestController {
    @Get('')
    async testfn(req: Request, res: Response){
        try {
            console.log("xxx")
            res.send('testing')
        } catch (error) {
            res.send()
        }
    }
}
