import validator from 'validator';

const password = 'password123';
validator.isLength(password, { min: 6, max: 16 });
