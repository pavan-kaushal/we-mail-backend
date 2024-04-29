require('dotenv').config('../.env');
import { Server } from '@overnightjs/core';
import { AuthController } from './controllers/auth.controller';
import config from "./environment.config";
import mongoose from 'mongoose';
import * as express from 'express';
import { RecipientController } from './controllers/recipient.controller';
import { decodeTokenFromHeaders } from './utils/helper-functions';
import responseMiddleware from './utils/response.middleware';
import { RESPONSE_CODES } from './enums/enums';
import morgan from 'morgan';
import { EventController } from './controllers/event.controller';
import { info } from 'node:console';
import environmentConfig from './environment.config';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { EmailIdentityController } from './controllers/email-identity.controller';
import { UserDataController } from './controllers/user-data.controller';

class App extends Server {
    port = config.port
    jwtEscapeUrls = ['/auth/signin','/auth/signup'];

    constructor(){
        super();
        this.corsPolicy();
        this.middleware();
        this.connectDb();
    }

    private corsPolicy() {
        express.Router()
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user, authorization");
            next();
        });
    }

    private middleware() {
        this.app.enable('trust proxy');
        this.app.use(express.json({ limit: '1024mb' }));
        this.app.use(express.urlencoded({ extended: false }));
        if(environmentConfig.environment=='development'){
            this.app.use(morgan('dev', { stream: { write: msg => info(msg) } }));
        } else {
            this.app.use(morgan('combined', { stream: { write: msg => info(msg) } }));
        }
        this.app.use((req, res, next) => {
            if(this.jwtEscapeUrls.includes(req.path)){
                next();
            } else {
                if(!req?.headers?.authorization){
                    if(req.method=='OPTIONS'){
                        next();
                    } else {
                        responseMiddleware(res,false,"Authorization Required",null,RESPONSE_CODES.TOKEN_EXPIRED);
                    }
                } else {
                    try {
                        const decodedToken = decodeTokenFromHeaders(req.headers.authorization as string)
                        const expiryDateUTC = moment(new Date(decodedToken.exp * 1000)).utcOffset("+5:30");
                        const currentDateUTC = moment().utcOffset("+5:30");
                        const token = req.headers.authorization.substring('Bearer '.length);
                        jwt.verify(token, config.authJwtSecret, {ignoreExpiration: true});
                        if (expiryDateUTC.isBefore(currentDateUTC)) {
                            throw Error("Authorization Expired")
                        } else {
                            next();
                        }
                    } catch (error: any) {
                        responseMiddleware(res,false,error.message,error,RESPONSE_CODES.TOKEN_EXPIRED)
                    }
                }
            }
        })
    }

    async connectDb() {
        let dbUrl = 'mongodb://' + config.dbhost + '/' + config.dbname;
        if (config.dbusername && config.dbpassword && config.dbsource) {
            dbUrl = 'mongodb://' + config.dbusername + ':' +
                config.dbpassword + '@' + config.dbhost +
                '/' + config.dbname + '?authSource=' + config.dbsource
        }

        try {
            mongoose.connection.on('connected', () => { console.log('Db connected'); });
            mongoose.connection.on('close', () => { console.log('lost Db connection'); });
            mongoose.connection.on('reconnected', () => { console.log('Db reconnected'); });
            mongoose.connection.on('error', () => { console.log('Db connection error'); });
            mongoose.set('strictQuery', true);
            await mongoose.connect(dbUrl,{}).then(() => {
                this.loadControllers();
            });
        } catch (err) {
            console.log('Error while db connection ' + JSON.stringify(err));
        }
    }

    loadControllers() {
        super.addControllers([
            new AuthController(),
            new RecipientController(),
            new EventController(),
            new EmailIdentityController(),
            new UserDataController()
        ])
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log("Server ready at port: " + this.port);
        })
    }
}

export default App;
