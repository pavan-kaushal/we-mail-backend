import { Server } from '@overnightjs/core';
import { AuthController } from './controllers/auth.controller';
import { config } from './environment.config';
import mongoose from 'mongoose';
import * as express from 'express';
//setup debugger -> DONE
//cors
//login middleware
//db connection -> DONE
class App extends Server {
    port = config.port
    constructor(){
        super();
        this.corsPolicy()
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
        super.addControllers([new AuthController()])
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log("Server ready at port: " + this.port);
        })
    }
}

export default App;
