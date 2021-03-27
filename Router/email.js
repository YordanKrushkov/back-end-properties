const Email= require ('../Utils/email');
const express = require('express');
const router = express.Router();

router.post('/email', async (req, res) => {
    const email = await Email(req,res);
    res.status(200).send(email);
})

module.exports = router;