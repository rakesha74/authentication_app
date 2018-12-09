var {users} = require('../models/users');

var authenticate = function(req,res,next){
    var token = req.query.token;

    users.findByToken(token).then(function(user){
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch(function(e){
        res.status(401).send();
    });
};

module.exports = authenticate;