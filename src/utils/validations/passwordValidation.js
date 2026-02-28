import * as yup from 'yup';

const passwordValidation = async (password) => {
  const schema = yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be at most 255 characters");

  try {
    await schema.validate(password);
    return { valid: true, message: "" };
  } catch (error) {
    return { valid: false, message: error.message };
  }
}

export default passwordValidation;