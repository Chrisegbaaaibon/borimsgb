const jwt = require('jsonwebtoken');
require('dotenv').config()
const { User } = require('../core/schema')

exports.verifyToken = async (req, res, next)=>{
    const token = req.headers.authorization || req.params.token || req.query.token || req.body.token;
    if(!token) res.status(401).json({
        message: "No token provided, login again"
    })

    await jwt.verify(token, process.env.ToKEN, async(err, decoded)=>{
        if(err) res.status(401).json({
            message: "token expired"
        }).redirect('/')
        let key = decoded._id
        const user = await User.findById(key)
        if(!user) res.status(401).json({
            message: " User not found"
        })

        return req.user = user
    })
    next()
}