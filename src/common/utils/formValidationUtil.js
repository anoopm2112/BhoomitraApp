import I18n from '../i18n';

const getNotValidErrorMessage = (fieldName) => {
    return `${fieldName} ${I18n.t('is_not_valid')}`;
};


export const validateEmail = (values, errors = {}, key = 'email') => {
    if (!values[key]) {
        errors[key] = I18n.t('please_enter_email_addr');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values[key])) {
        errors[key] = I18n.t('please_enter_valid_email_addr');
    }
    return errors;
};

export const validatePassword = (values, errors = {}, key = 'password') => {
    if (!values[key]) {
        errors[key] = I18n.t('please_enter_password');
    }
    return errors;
};

export const validateRequired = (values, key, fieldName, errors = {}, checkNull) => {
    if ((checkNull && values[key] == null) || (!checkNull && (!values[key] || (values[key] instanceof Array && !values[key].length))))
        errors[key] = `${fieldName} ${I18n.t('is_required')}`;
    return errors;
};

export const validateNumber = (values, key, fieldName, errors = {}, allowZero) => {
    if (!(/^\d*\.?\d+$/.test(values[key])) || values[key] < 0 || (!allowZero && values[key] === 0))
        errors[key] = getNotValidErrorMessage(fieldName);
    return errors;
};

export const validatePasswords = (values, errors = {}) => {
    let passwordKey = 'password';
    let confirmPasswordKey = 'confirmPassword';

    validateRequired(values, 'password', I18n.t('password'), errors);
    if (errors[passwordKey]) {
        return errors;
    }
    if (values[passwordKey].length < 7) {
        errors[passwordKey] = I18n.t('password_should_be_atleast_7_chars');
    } else if (!/^(?=.*\d).{1,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('password_should_contain_atleast_one_digit');
    } else if (!/^(?=.*[!@#$%^&*]).{1,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('password_should_contain_atleast_one_special_char');
    } else if (!/^(?=.*[a-zA-Z]).{1,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('password_should_contain_atleast_one_alphabet');
    } else if (!/^(?=.*[a-z]).{1,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('password_should_contain_atleast_one_lower_case');
    } else if (!/^(?=.*[A-Z]).{1,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('password_should_contain_atleast_one_upper_case');
    } else if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$/.test(values[passwordKey])) {
        errors[passwordKey] = I18n.t('please_enter_valid_password');
    }

    validateRequired(values, 'confirmPassword', I18n.t('password'), errors);
    if (errors[confirmPasswordKey]) {
        return errors;
    }
    if (values[passwordKey] !== values[confirmPasswordKey]) {
        errors[confirmPasswordKey] = I18n.t('passwords_do_not_match');
    }
    return errors;
};
