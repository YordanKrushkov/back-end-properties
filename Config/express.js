const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

module.exports = (app) => {
    app.use(express.static('public'));
    app.use(cors({
        exposedHeaders: 'Authorization',
    }));
    app.use(express.json({ limit: '50mb' }));
    app.use(cookieParser());
    app.use(express.urlencoded({
        limit: '50mb',
        extended: true
    }));
};