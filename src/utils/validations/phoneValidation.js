import * as yup from 'yup';

const phoneValidation = async (phone) => {
    const schema = yup.string()
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .required("Phone number is required")
        .min(8, "Phone number must be exactly 8 digits")
        .max(8, "Phone number must be exactly 8 digits");

    try {
        await schema.validate(phone);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default phoneValidation;
