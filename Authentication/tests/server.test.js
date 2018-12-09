const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const app = require('../app');
const {users} = require('../models/users');
const {users_mock, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);

describe('POST /signup', () => {
    it('should create a user', (done) => {
        var email = 'rakesha456@gmail.com';
        var password = 'e807f1fcf82d132f9bb018ca6738a19f';  //1234567890

        request(app)
            .post('/signup')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                var temp = JSON.parse(res.text);
                expect(temp.redirect).toNotBe("/?message=SignUp Failed...Please try again");
                done();
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                users.findOne({email}).then((user) => {
                    expect(user.token).toExist();
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                }).catch((e) => done(e));
            });
    });


});

describe('Login Flow', () => {
    it('GET /verifyEmail', (done) => {
        var token = users_mock[0].token;
        request(app)
            .get('/verifyEmail?token='+token)
            .expect(301)
            .end((err)=>{
                if(err){
                    return done(err);
                }
                users.findOne({token}).then((user) => {
                    expect(user.verified).toBe(true);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('POST /login', (done) => {
        var email = 'aagarwal@example.com';
        var password = 'd8578edf8458ce06fbc5bb76a58c5ca4';  //1234567890

        request(app)
            .post('/login')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                var temp = JSON.parse(res.text);
                expect(temp.redirect).toNotBe("/?message=Login Failed...Please try again");
            })
            .end(done);
    });

});

describe('Login Page', () => {
    it('should display a login page', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end(done);
    });

});

describe('Home Page', () => {
    it('should display home page with user id', (done) => {
        request(app)
            .get('/home?token='+users_mock[0].token)
            .expect(200)
            .end(done);
    });

});
