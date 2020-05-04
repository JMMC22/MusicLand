'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_QNnN3'

exports.createToken = function (user) {
    var payload = {
        sub: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    }

    return jwt.encode(payload, secret);
}