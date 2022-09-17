const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
    api_secret: process.env.CLOUD_SECRET,
    api_key: process.env.CLOUD_KEY,
    cloud_name: process.env.CLOUD_NAME
});


async function uploadFileResponse(fileData){

    const uploadResponse = await cloudinary.uploader.upload(
        fileData.tempFilePath,
        { resource_type: "auto" }
    );

    // res.send(`${uploadResponse.secure_url}`)
    return uploadResponse.secure_url
}

module.exports = uploadFileResponse
