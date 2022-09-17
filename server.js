const express = require('express');
require('dotenv').config()
const fileUpload = require('express-fileupload')
const route = require("./routes/route");
const app = express()

const PORT = 2001 || process.env.PORT
app.use(fileUpload({ useTempFiles: true }));

app.use(express.urlencoded({extended: false}));
app.use('/', route)
app.use(express.json());

app.listen(PORT, ()=>{
    console.log('App running')
})
