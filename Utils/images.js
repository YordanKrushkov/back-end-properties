const { cloudinary } = require('./cloudinary');

//Upload Images
const uploader = async (req) => {
    const fileStr = req.body.data;
    let imgs = [];
    try {
        for (let i = 0; i < fileStr.length; i++) {
            let file = fileStr[i];
            const uploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: "properties"
            })
            imgs.push(uploadResponse.public_id);
        }
        return imgs;
    } catch (error) {
        console.error(error);
    }
};

//Delete Images
const destroyImage = async (id) => {
    try {
        const uploadResponse = await cloudinary.uploader.destroy(id, {
            upload_preset: "properties"
        });
        return uploadResponse;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    uploader,
    destroyImage
}