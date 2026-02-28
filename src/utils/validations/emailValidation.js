import * as yup from 'yup';

const emailValidation = async (email) => {
    const schema = yup.string()
        .email("Email format is invalid")
        .required("Email is required")
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email format is invalid");

    try {
        await schema.validate(email);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default emailValidation;