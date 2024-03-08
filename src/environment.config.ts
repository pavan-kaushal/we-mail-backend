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
    readonly environment = process.env.environment || 'development'
    readonly port = process.env.PORT || 3000;
    readonly authJwtSecret = process.env.authJwtSecret || 'yo-its-a-secret';
    readonly authJwtExpireTime = process.env.authJwtExpireTime || '6h';
    readonly dbhost = process.env.dbhost || 'localhost';
    readonly dbusername = process.env.dbusername || '';
    readonly dbpassword = process.env.dbpassword || '';
    readonly dbname = process.env.dbname || 'wemail-db';
    readonly dbsource = process.env.dbsource || 'admin';
    readonly timezone = process.env.timezone || 'Asia/Kolkata';
    readonly saltRounds = process.env.saltRounds || 2;

    public get config(): IConfig{
        return this;
    }
}

export default new Config().config