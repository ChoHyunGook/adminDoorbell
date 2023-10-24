import bcrypt from "bcrypt"
import dotenv from 'dotenv'
import applyDotenv from "../../app/lambdas/applyDotenv.js";



export default function testUser(mongoose) {
    const {mongoUri, port, jwtSecret } = applyDotenv(dotenv)
    const userSchema = new mongoose.Schema({
        name: {type:String, required: true, min:2},
        userId: {type:String, unique: true, required: true, min:5},
        password: {type:String, required: true, trim: true, min:5},
        work: {type:String,trim:true, required:true},
    },{ versionKey : false });



    userSchema.pre('save', function (next){
        const user = this;
        const saltRounds = 10
        if(user.isModified('password')){
            bcrypt.genSalt(saltRounds,function (err,salt){
                if(err) return next(err)
                bcrypt.hash(user.password, salt, function (err, hash){
                    if(err) return next(err)
                    user.password = hash
                    next();
                });
            });
        }else {
            next()
        }
    });


    userSchema.methods.comparePassword = function (plainPassword, cb) {
        bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
            if (err) {
                return cb(err)
            } else {
                return cb(null, isMatch);
            }
        })
    };



    return mongoose.model('test', userSchema)
}