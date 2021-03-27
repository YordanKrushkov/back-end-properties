require('dotenv').config();
const express = require('express');
const app = express();
const config = require('./Config/config');
const router = require('./Router/properties');
const userRouter = require('./Router/users');
const emailRouter = require('./Router/email');
const db = require('./Config/database');
require('./Config/express')(app);

app.use('/properties', router);
app.use('/api', userRouter);
app.use('/api', emailRouter)

app.listen(config.port, (err) => {
    if (err) {
        console.log('Server error:', err);
        return;
    }
    db();
    console.log(`Server is listening on port:${config.port}`);
});