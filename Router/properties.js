const express = require('express');
const router = express.Router();
const { getAll, getOne, create, getSome,
    findThem, deleteProperty, updateProperty,
    deleteImagesFromProperty } = require('../Controllers/properties')

//qs stands for query string

router.get('/all', async (req, res) => {
    const properties = await getAll(req, res);
    res.status(200).send(properties);
})

router.get('/RENT', async (req, res) => {
    const qs = req.query;
    const properties = await getSome('RENT', qs);
    res.status(200).send(properties);
})

router.get('/SALE', async (req, res) => {
    const qs = req.query;
    const properties = await getSome('SALE', qs);
    res.status(200).send(properties);
});

router.get('/properties', async (req, res) => {
    const qs = req.query;
    const properties = await findThem(qs);
    res.status(200).send(properties);
});

router.get('/:id', async (req, res) => {
    const property = await getOne(req.params.id);
    res.status(200).send(property);
});

router.post('/create', async (req, res) => {
    const property = await create(req, res);
    property
        ? res.status(200).send(property)
        : res.status(404).send();
});

router.post('/delete', async (req, res) => {
    const user = await deleteProperty(req, res);
    res.status(200).send(user);
});

router.post('/update', async (req, res) => {
    const user = await updateProperty(req, res);
    user
        ? res.status(200).send(user)
        : res.status(404).send("error");
});

router.post('/updateImages', async (req, res) => {
    const user = await deleteImagesFromProperty(req, res);
    user
        ? res.status(200).send(user)
        : res.status(404).send("error");
})

module.exports = router