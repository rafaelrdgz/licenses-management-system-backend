import * as yup from 'yup';

const entityCodeValidation = async (entityCode) => {
    const schema = yup.string()
        .required("Entity code is required")
        .min(6, "Entity code must be at least 6 characters")
        .max(36, "Entity code must be at most 36 characters");

    try {
        await schema.validate(entityCode);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default entityCodeValidation;
