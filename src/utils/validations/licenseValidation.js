import * as yup from 'yup';

const licenseValidation = async (licenseId) => {
    const schema = yup.string()
        .matches(/^[0-9]+$/, "License ID must contain only numbers")
        .required("License ID is required")
        .min(6, "License ID must be exactly 6 digits")
        .max(6, "License ID must be exactly 6 digits")

    try {
        await schema.validate(licenseId);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default licenseValidation;
