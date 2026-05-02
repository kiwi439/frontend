export const ERROR_CODES = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_TAKEN: 'EMAIL_ALREADY_TAKEN'
};

export const VALIDATION_ERROR_MESSAGES = {
  name: 'Imię ma niepoprawny format!',
  surname: 'Nazwisko ma niepoprawny format!',
  email: 'Email ma niepoprawny format!',
  password: 'Hasło powinno mieć minimum 8 znaków, zawierać małą i dużą literę oraz cyfrę!',
  passwordIdentity: 'Hasła nie są identyczne!',
  avatar: 'Dozwolone formaty to: png, svg, jpeg',
  opinion: 'Opinia ma niepoprawny format!',
  street: 'Ulica ma niepoprawny format!',
  city: 'Miasto ma niepoprawny format!',
  postalCode: 'Kod pocztowy ma niepoprawny format!',
  phone: 'Telefon ma niepoprawny format!'
};
