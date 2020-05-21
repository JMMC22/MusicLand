var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('User Controller', function() {
    chai.use(chaiHttp);
    var url = "http://localhost:3800/api";
    let userId;
    let token;


    it('/register', function(done) {
        chai.request(url).post('/register').send({ username: 'testeoMocha', password: 'testeoMocha', email: 'testeoMocha@gmail.com' }).end(function(err, res) {
            expect(res).to.have.status(200);
            userId = res.body.user._id;
            done();
        })

    })
    it('/login', function(done) {
        chai.request(url)
            .post('/login')
            .send({ username: 'testeoMocha', password: 'testeoMocha', gettoken: 'true' })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                token = res.body.token;
                done();
            })

    })

    it('/user/:id', function(done) {
        chai.request(url).get('/user/' + userId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('/update-user/:id', function(done) {
        chai.request(url).put('/update-user/' + userId).send({ username: 'testeoMocha', email: 'testeoedit@gmail.com', avatar: "user.png" }).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            assert.equal('testeoedit@gmail.com', res.body.user.email)
            done();
        })
    })


    it('/users/:page', function(done) {
        let page = 1;
        chai.request(url).get('/users/' + page).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('/counters/:id', function(done) {
        chai.request(url).get('/counters/' + userId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('/similars-users', function(done) {
        chai.request(url).get('/similar-users').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })
    })

    it('/users-search/:usernameSearch/:page?', function(done) {
        let query = 'testeoMocha';
        chai.request(url).get('/users-search/' + query).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })
    })
    after(function(done) {

        chai.request(url).post('/login').send({ username: 'admin', password: 'admin', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);

            chai.request(url).delete('/user/' + userId).set('Authorization', res.body.token).end(function(err, res) {
                expect(res).to.have.status(200);
            })
            done();
        })


    })


})