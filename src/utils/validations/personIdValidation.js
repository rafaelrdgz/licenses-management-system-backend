import * as yup from 'yup';

const personIdValidation = async (id) => {
    const schema = yup.string()
        .matches(/^[0-9]+$/, "Person ID can only contain numbers.")
        .required("Person ID is required.")
        .min(11, "Person ID must be exactly 11 characters long.")
        .max(11, "Person ID must be exactly 11 characters long.")
    try {
        await schema.validate(id);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default personIdValidation;
