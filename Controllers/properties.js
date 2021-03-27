const Property = require('../Models/properties');
const User = require('../Models/users');
const jwt = require('jsonwebtoken');
const config = require('../Config/config');
const { verifyUser } = require('./auth');
const { uploader, destroyImage } = require('../Utils/images');

//Get All Properties
const getAll = async (req, res) => {
    const properties = await Property.find().limit(4).populate('ownerId').sort({ createdAt: -1 }).lean();
    verifyUser(req, res);
    return properties;
}

//Get filtred properties
const getSome = async (sellOrRent, qs) => {
    let way = '';
    let sortWay = 0;
    if (qs.sortBy === 'lowerPrice') {
        way = 'price',
            sortWay = 0;
    } else if (qs.sortBy === 'higherPrice') {
        way = 'price',
            sortWay = -1;
    } else if (qs.sortBy === 'newest') {
        way = 'date',
            sortWay = -1;
    };

    const properties = await Property.find()
        .where(sellOrRent ? { sellOrRent: sellOrRent } : null)
        .where(qs.city && qs.city != '0' ? { city: qs.city } : null)
        .where(qs.type && qs.type != '0' ? { type: qs.type } : null)
        .where(qs.bedrooms && qs.bedrooms != '0' ? { bedrooms: qs.bedrooms } : null)
        .where(qs.minPrice && qs.minPrice != '0' ? { price: { $gte: parseInt(qs.minPrice) } } : null)
        .where(qs.maxPrice && qs.maxPrice != '0' ? { price: { $lte: parseInt(qs.maxPrice) } } : null).populate('ownerId')
        .sort(qs.sortBy == 'newest' ? { updatedAt: -1 } : { price: Number(sortWay) }).lean()
    return properties;
};

//Get Searched Properties
const findThem = async (qs) => {
    const properties = await Property.find().where({ 'sellOrRent': qs.offer })
        .where(qs.city != 'undefined' && qs.city != 0 ? { city: qs.city } : null)
        .where(qs.type != 'undefined' && qs.type != 0 ? { type: qs.type } : null)
        .where(qs.bedrooms != 'undefined' && qs.bedrooms != 0 ? { bedrooms: qs.bedrooms } : null)
        .where(qs.minPrice != 'undefined' && qs.minPrice != 0 ? { price: { $gte: qs.minPrice } } : null)
        .where(qs.maxPrice != 'undefined' && qs.maxPrice != 0 ? { price: { $lte: qs.maxPrice } } : null).populate('ownerId').sort({ createdAt: -1 }).lean()
    return properties;
}

//Get Single Property
const getOne = async (id) => {
    const property = await Property.findById(id).populate('ownerId');
    return property;
}

//Create A Property
const create = async (req, res,) => {
    const token = req.headers.authorization;
    const data = req.body.prop;
    if (!token) {
        console.log('doest have token');
        return;
    };
    try {
        const imgs = await uploader(req, res);
        const img = await imgs[0];
        const key = jwt.verify(token, config.privateKey);
        const property = new Property({ ...data, img: img, images: imgs, ownerId: key.userId });
        const properties = await property.save();
        let email = key.email;
        const user = await User.findOneAndUpdate({ email }, {
            "$push": {
                "properties": properties._id
            }
        });
        return user;
    } catch (err) {
        console.log(err);
    }
}

//Delete Property
const deleteProperty = async (req, res) => {
    const token = req.headers.authorization;
    let id = req.body.id.split('property/')[1];
    if (!token) {
        console.log('doest have token');
        return;
    }
    try {
        const key = jwt.verify(token, config.privateKey);
        const { email } = key;
        await Property.findByIdAndDelete(id);

        const user = await User.findOneAndUpdate({ email }, {
            "$pull": {
                "properties": id
            }
        });
        return user;

    } catch (err) {
        console.log('delete', err);
        return;
    }
};

//Update Property
const updateProperty = async (req, res) => {
    const token = req.headers.authorization;
    const id = req.body.id;
    const body = req.body;
    const data = req.body.data;
    const prop = req.body.prop;
    let property = '';
    if (!token) {
        console.log('doest have token');
        return;
    }
    try {
        if (data) {
            const img = await uploader(req);
            property = await Property.findByIdAndUpdate({ _id: prop }, { "$addToSet": { 'images': [...img] } });
        } else {
            property = await Property.findByIdAndUpdate({ _id: id }, { "$set": { ...body } });
        }
        return property;

    } catch (err) {
        console.log('delete', err);
        return;
    }
}

//Delete Images From Property
const deleteImagesFromProperty = async (req, res) => {
    const token = req.headers.authorization;
    const id = req.body.id;
    const imageId = req.body.src.split('upload/')[1];
    if (!token) {
        console.log('doest have token');
        return;
    }
    try {

        await destroyImage(imageId);
        const property = await Property.findByIdAndUpdate({ _id: id }, { "$pull": { 'images': imageId } });
        return property;

    } catch (err) {
        console.log('delete', err);
        return;
    }
};

module.exports = {
    getAll,
    getOne,
    create,
    getSome,
    findThem,
    deleteProperty,
    updateProperty,
    deleteImagesFromProperty
}