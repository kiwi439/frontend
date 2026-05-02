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

// TODO
// 1. Uzywam innych kolorow do newsletter-a oraz innych rzeczy (rozne szare). Ten z newsletter-a chyba jest ladniejszy
// 2. Data zakupu ma zle formatowanie 2.05.2026, 10:50:01 - brakuje 02
// 3. Zamiast komponentu "Twoj koszyk jest pusty" mozna zrobic disabled basket i wyswietlic modal
// 4. frontend/src/data/uiElements.ts - Czy ten plik ma sens?
