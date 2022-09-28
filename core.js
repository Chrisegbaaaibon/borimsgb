const cloudinary = require('cloudinary').v2;
require('dotenv').config()
const schema = require('./v1/core/schema')

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

const nodemailer = require('nodemailer');

const sendMail =  async(options)=>{
    const  transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: process.env.PASS
        }
    });

    let message = {
        from: '',
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html
    }

    return await transporter.sendMail(message)
}

exports.updateToken = async (id, key)=>{
    try {
        await schema.User.findByIdAndUpdate(id, {
            token: key
        })
        return true;
    }catch (e) {
        Error(e.stack);
    }
}

module.exports = {
    uploadFileResponse,
    sendMail
}
