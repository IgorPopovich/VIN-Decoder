/** VIN: лише латинські літери (крім I, O, Q) та цифри, макс. 17 символів */
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{1,17}$/i;

export function validateVin(value) {
  const str = String(value).trim();
  if (!str) {
    return 'Введіть VIN-код';
  }
  if (str.length > 17) {
    return 'VIN не може бути довшим за 17 символів';
  }
  if (!VIN_REGEX.test(str)) {
    return 'VIN може містити лише латинські літери (крім I, O, Q) та цифри';
  }
  return null;
}
