import { Response } from "express";
import { RESPONSE_CODES } from "../enums/enums";

const responseMiddleware = (res: Response, success: boolean, message: string, data?: any, code=RESPONSE_CODES.DEFAULT) => {
    return res.send({
        data: data,
        success: success,
        message: message,
        code: code,
    });
}

export default responseMiddleware