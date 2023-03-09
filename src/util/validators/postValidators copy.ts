import validator from 'validator';

function title(input: string) {
  return (
    validator.isAlpha(input) ||
    !validator.isEmpty(input) ||
    validator.isLength(input, { min: 4, max: 60 })
  );
}
function description(input: string) {
  return !validator.isEmpty(input) || validator.isLength(input, { min: 60 });
}

const validators = {
  title,
  description,
};

const postValidator = (body: { title: string; description: string }) => {
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

export default postValidator;
