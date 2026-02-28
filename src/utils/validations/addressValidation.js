import * as yup from 'yup';

const addressValidation = async (address) => {
  const schema = yup.string()
    .required("Address is required.")
    .min(10, "Address must be at least 10 characters long.")
    .max(100, "Address must be at most 100 characters long.");

  try {
    await schema.validate(address);
    return { valid: true, message: "" };
  } catch (error) {
    return { valid: false, message: error.message };
  }
};

export default addressValidation;
