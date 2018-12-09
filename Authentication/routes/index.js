var express = require('express');
var router = express.Router();
var transporter = require('../public/javascripts/email').transporter;
var mailOptions = require('../public/javascripts/email').mailOptions;
const nodemailer = require('nodemailer');
const _ = require('lodash');
var {users} = require('../models/users');
var authenticate = require('../middleware/authenticate');

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.query.message){
        res.render("login.hbs",{
            message:req.query.message
        });
    }else{
        res.render("login.hbs");
    }

});

router.get('/home',authenticate,function(req,res,next){
    res.render("temp.hbs",{
        welcomeMessage:req.user.email
    });
})

router.post('/signup', function(req,res,next){

    var body = _.pick(req.body,['email','password','name','contact_detail']);

    mailOptions.to = req.body.email;

    var user_ = new users(body);

    user_.save().then(function(){
        return user_.generateAuthToken();
    }).then(function(token){
        mailOptions.html = 'Please verify Your Email<br>'+'<a href="http://localhost:3000/verifyEmail?token='+token+"\">Verify Email</a>";
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.sendStatus(404);
            }
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.send({ redirect: '/?message=SignUp Successful...Please verify Email and then Login'});
        });

    }).catch(function(e){
        console.log(e);
        res.send({ redirect: '/?message=SignUp Failed...Please try again'});
    });

});

router.post("/login",function(req,res,next){

    var body = _.pick(req.body,['email','password']);

    users.findByCredentials(body.email,body.password).then(function(user){
        res.send({ redirect: '/home?token='+user.token});
    }).catch(function(e){
        res.send({ redirect: '/?message=Login Failed...Please try again'});
    });

});

router.get('/verifyEmail',authenticate,function(req,res,next){

    res.redirect(301,'/home?token='+req.token);

});

module.exports = router;
