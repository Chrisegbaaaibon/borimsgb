const route = require('express').Router();
const updloadFileResponse = require('../core')
const jwt = require('jsonwebtoken');
const {response} = require("express");
require('dotenv').config()

route.post('/post', async (req, res)=>{
    try {
        const photos = req.files.photos;
        const {
            title,
            name,
            message
        } = req.body;
        let urls = [];

        for(let i=0; i < photos.length; i++){
            let url = await updloadFileResponse(req.files.photos[i])
            urls.push(url)
        }
        await jwt.sign({
            "title": title,
            "name": name,
            "message": message,
            "photos": urls
        }, process.env.TOKEN, {
            expiresIn: '1d'
        },async (err, response)=>{
            if(err) res.status(400).json({
                Error: "An error occurred."
            })
            return res.status(200).json({
                link: `http://localhost:2001/view/${response}`
            })
        })
    }catch (e) {
        console.log('An error occurred. Try again later.', e)
    }
})

route.get('/view/:token', async (req, res)=>{
  try {
      const token = req.params.token;
      await jwt.verify(token, process.env.TOKEN, async(err, response)=>{
          if(err) res.status(400).json({
              Error: "An error occurred."
          })
          return res.status(200).json({
              response
          })
      })
  }catch (e) {
      console.log('An error occurred.', e)
  }
})

module.exports = route;