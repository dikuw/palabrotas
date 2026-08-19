/** Course / lesson vocabulary uses this instead of a single country code. */
export const ALL_COUNTRIES_CODE = 'all';
export const LATIN_AMERICA_CODE = 'latam';
export const EUROPE_CODE = 'europe';

export function isAllCountriesCode(code) {
  if (code === undefined || code === null) return false;
  return String(code).trim().toLowerCase() === ALL_COUNTRIES_CODE;
}

export function isLatinAmericaCode(code) {
  if (code === undefined || code === null) return false;
  return String(code).trim().toLowerCase() === LATIN_AMERICA_CODE;
}

export function isEuropeCode(code) {
  if (code === undefined || code === null) return false;
  return String(code).trim().toLowerCase() === EUROPE_CODE;
}

export function isRegionCode(code) {
  return isAllCountriesCode(code) || isLatinAmericaCode(code) || isEuropeCode(code);
}

export const regionOptions = [
  { name: 'Global', code: ALL_COUNTRIES_CODE },
  { name: 'Latin America', code: LATIN_AMERICA_CODE },
  { name: 'Europe', code: EUROPE_CODE },
];

export const countries = [
  { name: "Argentina", code: "AR" },
  { name: "Bolivia", code: "BO" },
  { name: "Chile", code: "CL" },
  { name: "Colombia", code: "CO" },
  { name: "Costa Rica", code: "CR" },
  { name: "Cuba", code: "CU" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "El Salvador", code: "SV" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Guatemala", code: "GT" },
  { name: "Honduras", code: "HN" },
  { name: "Mexico", code: "MX" },
  { name: "Nicaragua", code: "NI" },
  { name: "Panama", code: "PA" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Puerto Rico", code: "PR" },
  { name: "Spain", code: "ES" },
  { name: "Uruguay", code: "UY" },
  { name: "Venezuela", code: "VE" }
];

export function getRegionLabel(code, t) {
  if (!code) return '';
  if (isAllCountriesCode(code)) return t('All regions');
  if (isLatinAmericaCode(code)) return t('Latin America');
  if (isEuropeCode(code)) return t('Europe');
  const upper = String(code).toUpperCase();
  const found = countries.find((c) => c.code === upper);
  return found ? t(found.name) : upper;
}
