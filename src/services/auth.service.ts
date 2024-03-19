import { Types } from "mongoose";
import environmentConfig from "../environment.config";
import { IUser, User } from "../models/user.model"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EmailIdentity } from "../models/email-identity.model";

const generateToken = (payload: {
    _id: string,
    name: string,
    email: string,
}) => {
    const authToken = jwt.sign(payload, environmentConfig.authJwtSecret,{ expiresIn: environmentConfig.authJwtExpireTime })
    return authToken
}

export const userSignin = async (email: string, password: string) => {
    const emailIdentity = await EmailIdentity.findOne({
        email: email,
    }).populate('user').lean();
    if(!emailIdentity){
        throw Error("Invalid Credentials")
    }
    if(!emailIdentity.isVerified){
        throw Error("Email not Verified")
    }
    const user = emailIdentity.user as IUser;
    if(!bcrypt.compareSync(password,user.password)){
        throw Error("Wrong Password")
    }
    const authToken = generateToken({
        _id: user._id.toString(),
        name: user.name,
        email: emailIdentity.email,
    })
    
    return {authToken}
}

const hashPassword = async (password: string) => {
    const saltRounds = environmentConfig.saltRounds;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const userSignup = async (name: string, email: string, password: string) => {
   const existingEmailDoc = await EmailIdentity.findOne({
    email: email
   }).lean();
   if(existingEmailDoc){
    throw Error(`Email Already in use`)
   }
   password = await hashPassword(password)
   const emailIdentity = await EmailIdentity.create({
        email: email,
        isVerified: true,
   })
   const user = await User.create({
    name: name,
    password: password,
    emailIdentity: emailIdentity._id
   });
   await EmailIdentity.findByIdAndUpdate(emailIdentity._id,{
    $set: {
        user: user._id
    }
   })
}