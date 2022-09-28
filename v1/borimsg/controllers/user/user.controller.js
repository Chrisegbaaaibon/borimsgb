const { User } = require('../../../core/schema')
const jwt = require('jsonwebtoken');
const {sendMail, updateToken} = require("../../../../core");
const bcrypt = require("bcrypt");

exports.register  = async (req, res)=>{
    try{
        const fullName = req.body.fullName;
        const email = req.body.email;
        const DOB = req.body.DOB;
        const userName = req.body.userName;
        const sex = req.body.sex;

        if(!fullName || !email || !DOB || !userName || !sex) {
            res.status(401).json({
                message: "Go fill the rest!"
            })
        }

        const oldUser = await User.findOne({ email: email}) || await User.findOne({ userName: userName})
        if(oldUser){
            res.status(401).json({
                message: 'An account with this mail or username has already existed.'
            })
        }

        const token = await jwt.sign({
            "fullName": fullName,
            "sex": sex,
            "email": email,
            "userName": userName,
            "DOB": DOB
        }, process.env.TOKEN, {
            algorithm:'SHA1'
        })
        await sendMail({
            email: email,
            subject: 'Email Verification',
            html:  `<p>Please click the link below to verify your email</p>
              <a href="http://localhost:2001/v1/auth/activate?token=${token}">Verify</a>`
        })
        return res.status(201).json({
            token: token
        })
    }catch (e) {
        console.log(e)
        res.status(500).json({
            e: e,
            message: 'Internal Server error'
        })
    }
}

exports.verifySignUp = async (req, res)=>{
    try {
        const token = req.query.token;
        const password = req.body.password
        if(!password) {
            res.status(401).json({
                message: 'All field is required'
            })
        }
        if(!token) console.log('No token!')
        await jwt.verify(token, process.env.TOKEN, async (err, decoded)=>{
            if(err) console.log(err)
            const {fullName, email, DOB, userName, sex } = decoded
            const newUser = new User({
                fullName,
                email,
                DOB,
                password,
                sex,
                userName,
            })
            const oldUser = User.findOne({ email: email})
            if (oldUser.email === email) res.status(200).json({
                message: "Successfully activated"
            })
            await jwt.sign({
                    email,
                },
                process.env.TOKEN,
                {expiresIn: '1h'},
                async (err, token) => {
                    if (err) {
                        console.log(err)}
                    await newUser.save();
                    await updateToken(newUser._id, token)
                    return res.status(201).json({ message: `Email Verified`, data: token })
                })
        })

    }catch (e) {
        console.log(e)
        new Error(e.stack)
    }
}

exports.loginUser = async (req, res)=>{
    try {
        const key = req.body.email;
        const password = req.body.password;
        if(!password || !key) {
            res.status(401).json({
                message: 'All fields are required'
            })
        };

        const oldUser = await User.findOne({ email: key });


        if(!oldUser) {
            res.status(401).json({
                message: 'This user does not have an account'
            })
        }
        const isMatch = bcrypt.compareSync(password, oldUser.password);
        if(!isMatch) {
            res.status(400).json({
                message: 'Wrong password'
            })
        }
        const token = jwt.sign({"email": oldUser.email, "_id": oldUser._id}, process.env.TOKEN, {
            expiresIn: '1h'
        })
        await updateToken(oldUser._id, token);
        return res.status(200).json({
            token: token
        })
    }catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Internal Server error'
        })
    }
}
