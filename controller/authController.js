const _ = require('lodash');
const User = require('../models/user');
const AppError = require('../utils/AppError');

//  @desc   Registers a new user into the server
//  @route  POST /api/v1/auth/signup
//  @access Public
//  @param  Email Password FirstName LastName
module.exports.signUp = async (req, res, next) => {
    const body = _.pick(req.body, [
        'email',
        'password',
        'firstName',
        'lastName',
    ]);

    const user = await User.create(body);
    sendTokenResponse(user, res);
};

//  @desc   Logins a new user into the server and returns him an access token
//  @route  POST /api/v1/auth/login
//  @access Public
//  @param  Email Password
module.exports.login = async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
        return next(new AppError('Invalid Credntials', 400));
    }

    const isValidPass = await user.verifyPassword(req.body.password);
    if (!isValidPass) {
        return next(new AppError('Invalid Credntials', 400));
    }

    sendTokenResponse(user, res);
};

const sendTokenResponse = async (user, res) => {
    const token = await user.generateAuthToken();

    res.status(200).json({
        success: true,
        data: {
            'token': token
        }
    });
}
