export default () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    proxy: {
        host: process.env.PROXY_HOST,
        port: parseInt(process.env.PROXY_PORT, 10) || 5435,
        username: process.env.PROXY_USERNAME,
        password: process.env.PROXY_PASSWORD,
    },
});
