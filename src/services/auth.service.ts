import environmentConfig from "../environment.config";
import { IUser, User } from "../models/user.model"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const generateToken = (payload: {
    _id: string,
    name: string,
    email: string,
}) => {
    const authToken = jwt.sign(payload, environmentConfig.authJwtSecret,{ expiresIn: environmentConfig.authJwtExpireTime })
    return authToken
}

export const userSignin = async (email: string, password: string) => {
    const user = await User.findOne({
        email: email,
    }).lean();
    if(!user){
        throw Error("Invalid Credentials")
    }
    if(!bcrypt.compareSync(password,user.password)){
        throw Error("Wrong Password")
    }
    const authToken = generateToken({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
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
   const existingUserDoc = await User.findOne({
    email: email
   }).lean();
   if(existingUserDoc){
    throw Error(`Another User With Email Exists`)
   }
   password = await hashPassword(password)
   await User.create({
    name: name,
    email: email,
    password: password,
   });
}