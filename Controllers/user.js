const User = require('../Models/users');
const Property = require('../Models/properties');
const jwt = require('jsonwebtoken');
const config = require('../Config/config');
const { cloudinary } = require('../Utils/cloudinary');

//Get USER
const getuser = async (req, res) => {
    const token = await req.headers.authorization;
    if (!token) {
        return;
    }
    try {
        const key = await jwt.verify(token, config.privateKey)
        if (key) {
            const { email} = key;
            const user = await User.findOne({ email }).populate('properties').populate('likedProperties');
            if (!user) {
                console.log('Wrong username or password 2');
                return;
            }
            res.status(200).send(user);
        }
    } catch {
        res.status(404).send();
        return;
    }
};

//Like Property
const likeProp = async (req, res) => {
    const token = await req.headers.authorization;
    const like = req.headers.like;
    const dislike = req.headers.dislike;
    if (!token) {
        return;
    }
    try {
        const key = await jwt.verify(token, config.privateKey);
        if (key) {
            const { email, userId } = key;
            let user = '';
            let property = '';
            if (like) {
                user = await User.findOneAndUpdate({ email }, {
                    "$addToSet": {
                        "likedProperties": like,
                    }
                });
                property = await Property.findOneAndUpdate({ _id: like }, {
                    "$addToSet": {
                        "liked": userId,
                    }
                });

            }
            if (dislike) {
                user = await User.findOneAndUpdate({ email }, {
                    "$pull": {
                        "likedProperties": dislike,
                    }
                });
                property = await Property.findOneAndUpdate({ _id: dislike }, {
                    "$pull": {
                        "liked": userId,
                    }
                });
            }
            if (!user) {
                console.log('Wrong username or password 2');
                return;
            }
            return user, property;
        }
    } catch (err) {
        console.log('like', err);
        return;
    }
};
//Update User

const updateUser = async (req, res) => {
    const token = await req.headers.authorization;
    const data = req.body.prop;
    const fileStr = req.body.data;
    let img = '';
    if (!token) {
        return;
    }
    try {
        if (fileStr) {
            let file = fileStr;
            const uploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: "properties"
            });
            img = uploadResponse.public_id;
        };
        const key = await jwt.verify(token, config.privateKey);
        if (key) {
            const { email} = key;
            const user = await User.findOneAndUpdate({ email }, { "$set": { "name": data.name, "surname": data.surname, "address": data.address, "phone": data.phone, "profilephoto": (img || data.profilephoto) } });
            res.status(200).send(user);
        }
    } catch (err) {
        console.log("catch", err);
        res.status(404).send();
        return;
    };
};
module.exports = { getuser, likeProp, updateUser };