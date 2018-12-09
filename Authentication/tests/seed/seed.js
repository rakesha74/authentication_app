const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {users} = require('../../models/users');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users_mock = [{
    _id: userOneId,
    email: 'rakesha33@gmail.com',
    password: 'e10adc3949ba59abbe56e057f20f883e' ,
    token: jwt.sign({_id: userOneId}, 'abc123').toString()

}, {
    _id: userTwoId,
    email: 'aagarwal@example.com',
    password: 'd8578edf8458ce06fbc5bb76a58c5ca4',
    verified:true
}];


const populateUsers = (done) => {
    users.remove({}).then(() => {
        var userOne = new users(users_mock[0]).save();
        var userTwo = new users(users_mock[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => {
        done();
    }).catch((e)=>{
        done(e);
    });
};

module.exports = {users_mock, populateUsers};
