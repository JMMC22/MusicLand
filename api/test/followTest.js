var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('Follow Controller', function() {
    chai.use(chaiHttp);
    var url = "http://localhost:3800/api";
    let userId;
    let artistId;
    let token;

    before(function(done) {

        chai.request(url).post('/login').send({ username: 'user', password: 'user', gettoken: 'true' }).end(function(err, res) {
            expect(res).to.have.status(200);
            token = res.body.token;
            chai.request(url).post('/login').send({ username: 'josmarcre', password: 'josmarcre' }).end(function(err, res) {
                expect(res).to.have.status(200);
                userId = res.body.user._id;

            })
            done();
        })


    })


    it('/follow', function(done) {

        setTimeout(function() {
            try {
                chai.request(url).post('/follow').send({ followed: userId }).set('Authorization', token).end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
            } catch (e) {
                done(e);
            }
        }, 500);


    })

    it('/following/:id', function(done) {

        chai.request(url).get('/following').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/followed/:id', function(done) {

        chai.request(url).get('/followed/' + userId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/my-follows', function(done) {

        chai.request(url).get('/my-follows').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/my-followed', function(done) {

        chai.request(url).get('/my-followed').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/unfollow', function(done) {

        chai.request(url).delete('/unfollow/' + userId).set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })




})