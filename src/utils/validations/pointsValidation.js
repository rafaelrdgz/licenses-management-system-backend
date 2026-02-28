import * as yup from 'yup';

const pointsValidation = async (points) => {
    const schema = yup.number()
        .required("Points are required")
        .moreThan(-1, "Points must be greater than -1");

    try {
        await schema.validate(points);
        return { valid: true, message: "" };
    } catch (error) {
        return { valid: false, message: error.message };
    }
}

export default pointsValidation;
