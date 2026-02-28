import passwordValidation from './passwordValidation.js';
import emailValidation from './emailValidation.js';
import pointsValidation from './pointsValidation.js';
import phoneValidation from './phoneValidation.js';
import personIdValidation from './personIdValidation.js';
import nameValidation from './nameValidation.js';
import licenseValidation from './licenseValidation.js';
import entityCodeValidation from './entityCodeValidation.js';
import addressValidation from './addressValidation.js';

const validateController = async (type, value) => {
  let validationFunction;

  switch (type) {
    case 'password':
      validationFunction = passwordValidation;
      break;
    case 'email':
      validationFunction = emailValidation;
      break;
    case 'points':
      validationFunction = pointsValidation;
      break;
    case 'phone':
      validationFunction = phoneValidation;
      break;
    case 'personId':
      validationFunction = personIdValidation;
      break;
    case 'name':
      validationFunction = nameValidation;
      break;
    case 'license':
      validationFunction = licenseValidation;
      break;
    case 'entityCode':
      validationFunction = entityCodeValidation;
      break;
    case 'address':
      validationFunction = addressValidation;
      break;
    default:
      console.error("Invalid validation type");
      return;
  }

  const result = await validationFunction(value);

  if (!result.valid) {
    const error = new Error("Validation failed: Invalid input");
    error.status = 401;
    throw error;
  }
}

export default validateController;
