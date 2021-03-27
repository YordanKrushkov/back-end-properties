const env = process.env.NODE_ENV || 'development'

const config = {
    development: {
        port: process.env.PORT ||80,
        dbURL: process.env.DB_URL,
        privateKey: process.env.PRIVATE_KEY
    },
    production: {
        dbURL: process.env.DB_URL,
        privateKey: process.env.PRIVATE_KEY
    }
};

module.exports = config[env];