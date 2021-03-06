const { body } = require('express-validator');

// Validates the body of request
module.exports = () => {
    return [
        body('email').exists().isEmail(),
        body('password').exists().isLength({ min: 6 }),
        body('firstName').exists(),
        body('lastName').exists(),
        body('fcmToken').exists(),
    ];
};
