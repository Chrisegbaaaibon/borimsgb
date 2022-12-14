const route = require('express').Router();
const {uploadFileResponse} = require('../core')
const jwt = require('jsonwebtoken');
const {verifyToken} = require("../v1/core/verifyToken");
const {register, verifySignUp, loginUser} = require("../v1/borimsg/controllers/user/user.controller");
require('dotenv').config()

route.post('/register', register);
route.post('/auth/activate', verifySignUp);
route.post('/login', loginUser)

route.post('/post', verifyToken, async (req, res)=>{
    try {
        const photos = req.files.photos;
        const {
            title,
            name,
            message,
            view
        } = req.body;
        let urls = [];

        for(let i=0; i < photos.length; i++){
            let url = await uploadFileResponse(req.files.photos[i])
            urls.push(url)
        }
        await jwt.sign({
            "title": title,
            "name": name,
            "message": message,
            "photos": urls,
            "view": view
        }, process.env.TOKEN, {
            expiresIn: '1d'
        },async (err, response)=>{
            if(err) res.status(400).json({
                Error: "An error occurred."
            })
            return res.status(200).json({
                link: `https://borimsg.herokuapp.com/view/${response}`
            })
        })
    }catch (e) {
        console.log('An error occurred. Try again later.', e)
    }
})

route.get(`/view/:token`, async (req, res)=>{
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

route.get('/', async (req, res)=>{
    res.status(200).json({
        version: 'v1'
    })
})

module.exports = route;