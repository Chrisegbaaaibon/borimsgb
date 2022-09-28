const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        sex: {
            type: String,
            enum: ['Male', 'Female', 'PFS'] //prefer not to say
        },
        DOB: {
            type: Number,
            default: Date.now()
        }
    },{
        timestamps: true
    }
)

UserSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema)


module.exports = {
    User: User
}
