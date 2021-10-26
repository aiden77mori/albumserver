const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validationLogin(data) {
    let errors = {};

    data = !isEmpty(data) ? data : '';

    if(Validator.isEmpty(data)) {
        errors.login_error = 'Phone number is empty.';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

