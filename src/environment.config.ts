export const config = {
    port : process.env.PORT || 3000,
    jwtSecret: process.env.jwtSecret || 'yo-its-a-secret',
    tokenExpireTime: process.env.tokenExpireTime || '10d',
    refreshJwtSecret: process.env.refreshJwtSecret || 'yo-its-a-black_box',
    dbhost: process.env.dbhost || 'localhost',
    dbusername : process.env.dbusername || '',
    dbpassword : process.env.dbpassword || '',
    dbname: process.env.dbname || 'wemail-db',
    dbsource: process.env.dbsource || 'admin',
    timezone: process.env.timezone || 'Asia/Kolkata',
}