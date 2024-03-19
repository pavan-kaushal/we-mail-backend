interface IConfig {
    environment: any,
    port: any,
    authJwtSecret: any,
    authJwtExpireTime: any,
    dbhost: any,
    dbusername: any,
    dbpassword: any,
    dbname: any,
    dbsource: any,
    timezone: any,
    saltRounds: any,
}

class Config implements IConfig {
    readonly environment = process.env.environment
    readonly port = process.env.PORT;
    readonly authJwtSecret = process.env.authJwtSecret;
    readonly authJwtExpireTime = process.env.authJwtExpireTime;
    readonly dbhost = process.env.dbhost;
    readonly dbusername = process.env.dbusername;
    readonly dbpassword = process.env.dbpassword;
    readonly dbname = process.env.dbname ;
    readonly dbsource = process.env.dbsource;
    readonly timezone = process.env.timezone;
    readonly saltRounds = process.env.saltRounds;

    public get config(): IConfig{
        return this;
    }
}

export default new Config().config