const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validationRegister(data) {
    let errors = {};

    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';

    if(Validator.isEmpty(data.first_name)) {
        errors.first_name = 'First name is empty.';
    }

    if(Validator.isEmpty(data.last_name)) {
        errors.last_name = 'Last name is empty.';
    }

    if(Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'Phone number is empty.';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

