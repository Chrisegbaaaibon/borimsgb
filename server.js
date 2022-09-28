const express = require('express');
require('dotenv').config()
const fileUpload = require('express-fileupload')
const route = require("./routes/route");
const app = express()

app.use(fileUpload({ useTempFiles: true }));

app.use(express.urlencoded({extended: false}));
app.use('/v1', route)
app.use(express.json());

app.listen(process.env.PORT || 2001, ()=>{
    console.log('App running')
})
