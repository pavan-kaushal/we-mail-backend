import { Server } from '@overnightjs/core';
import { TestController } from './controllers/test';
import { config } from './environment.config';
const mongoose = require('mongoose')
//setup debugger
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

    private corsPolicy(){

    }

    async connectDb() {
        let dbUrl = 'mongodb://' + config.dbhost + '/' + config.dbname;
        if (config.dbusername && config.dbpassword && config.dbsource) {
            dbUrl = 'mongodb://' + config.dbusername + ':' +
                config.dbpassword + '@' + config.dbhost +
                '/' + config.dbname + '?authSource=' + config.dbsource
        }
        console.log(dbUrl)
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
        super.addControllers([new TestController()])
    }

    public start() {
        this.app.listen(this.port, () => {
            console.log("Server ready at port: " + this.port);
        })
    }
}

export default App;
