var assert = require('chai').assert;
var expect = require('chai').expect;
var chaiHttp = require('chai-http');
var chai = require('chai');
var User = require('../models/user');

var app = require('../app');

describe('Message Controller', function() {
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


    it('/message', function(done) {

        setTimeout(function() {
            try {
                chai.request(url).post('/message').send({ receiver: userId, text: 'Test' }).set('Authorization', token).end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                })
            } catch (e) {
                done(e);
            }
        }, 500);


    })

    it('/messages-rec', function(done) {

        chai.request(url).get('/messages-rec').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })

    it('/messages-sends', function(done) {

        chai.request(url).get('/messages-sends').set('Authorization', token).end(function(err, res) {
            expect(res).to.have.status(200);
            done();
        })

    })





})