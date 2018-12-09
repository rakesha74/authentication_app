const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message: " It is not a valid email"
        }
    },
    password:{
        type: String,
        required:true
    },
    token:{
        type:String
    },
    verified:{
        type:Boolean,
        default:false
    },
    name:{
        type:String
    },
    contact_detail:{
        type:String
    }
});

UserSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(user.password,salt);
                user.password = hash;
                next();

    }else{
        next();
    }

});

UserSchema.methods.generateAuthToken=function(){   //arrow function we cannot use here as we cannot use this in arrow function.

    var user = this;
    var token = jwt.sign({_id:user._id.toString()},'abc123').toString();  //Secret key 'abc123' we can put in configuration file.

    user.token = token;

    return user.save().then(function(){
        return token;
    });
};

UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){

        return Promise.reject('test');
    }

    return User.findOneAndUpdate({
        '_id':decoded._id,
        'token':token
    },{
        $set:
            {verified:true}
    })
};

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;

    return User.findOne({email:email, verified:true}).then(function (user){
        if(!user){
            return Promise.reject();
        }

        return new Promise(function(resolve,reject){

            var pass = bcrypt.compareSync(password,user.password);
            if(pass){
                resolve(user);
            }else{
                reject(null);
            }
        });
    });
};

var users = mongoose.model('user',UserSchema);

module.exports={users};