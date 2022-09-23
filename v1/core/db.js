const mongoose = require('mongoose').Mongoose;

exports.db = async ()=>{
    await mongoose.connect(process.env.MONGO_URI, ()=>{
        console.log('Db connected successfully.')
    })
}