const mongoose = require('mongoose');
const config = require('./config');

module.exports = () => {
    return mongoose.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
        if (err) {
            console.log(`DB error:`, err);
            return;
        }
        console.log(`You are connected to the DB`);
    })
};
