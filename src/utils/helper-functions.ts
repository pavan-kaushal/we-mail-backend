import { NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";

export const decodeTokenFromHeaders = (authorizationHeader: string) => {
    const token = authorizationHeader.substring('Bearer '.length);
    try {
        const decodedToken: any = jwtDecode(token)
        return decodedToken
    } catch (error) {
        throw Error(`Error Decoding Token: ${JSON.stringify(error)}`)
    }
}

export const formatRegex = (text: string) => {
    text = text.trim();
    text = text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
    text = `^${text}$`
    return new RegExp(text, 'i');
}