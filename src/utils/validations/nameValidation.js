import * as yup from 'yup';

const nameValidation = async (name) => {
    const schema = yup.string()
        .matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ ]+$/, "Name can only contain letters and spaces.")
        .required("Name is required.")
        .min(3, "Name must be at least 3 characters long.")
        .max(50, "Name must be at most 50 characters long.");

    try {
        await schema.validate(name);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default nameValidation;
