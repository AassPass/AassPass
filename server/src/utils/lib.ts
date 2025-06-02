import { randomBytes } from 'crypto';


const generatePassword = (length = 12) => {
  return randomBytes(length).toString('base64').slice(0, length);
};

export { generatePassword };
