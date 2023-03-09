import validator from 'validator';

function email(input: string) {
  return validator.isEmail(input);
}
function password(input: string) {
  return (
    validator.isAlpha(input) ||
    !validator.isEmpty(input) ||
    validator.isLength(input, { min: 6, max: 16 })
  );
}
function name(input: string) {
  return validator.isLength(input, { min: 2, max: 24 });
}
function age(input: string) {
  return validator.isInt(input, { min: 10, max: 99 });
}
const validators = {
  email,
  password,
  name,
  age,
};

const userValidator = (body: {
  email: string;
  password: string;
  name?: string;
  age?: string;
}) => {
  for (const field in body) {
    if (
      validators[field as keyof typeof validators](
        body[field as keyof typeof body] + ''
      )
    ) {
      return field;
    }
  }
};

export default userValidator;
