import validator from 'validator';

// utility
const { isURL } = validator;

// // for reference
// const envVars = [
//   {
//     name: 'APP_BASE_URL',
//     confidential: false,
//     critical: true,
//     devDefaultValue: 'http://localhost:5173',
//     validate: (value: string) => isURL(value),
//   },
//   {
//     name: 'API_BASE_URL',
//     confidential: false,
//     critical: true,
//     devDefaultValue: 'http://localhost:3000',
//     validate: (value: string) => isURL(value),
//   },
//   {
//     name: 'SESSION_COOKIE_SECRET',
//     confidential: true,
//     critical: true,
//     nonProdDefaultValue: '__INSECURE__session_cookie_secret_dev',
//   },
//   {
//     name: 'ALLOW_SESSION_COOKIE_WITHOUT_HTTPS',
//     confidential: false,
//     critical: false,
//     defaultValue: false,
//     devDefaultValue: true,
//     transform: (value: string) => value === 'true',
//   },
// ];

/**
 * Encapsulates environment mode for the rest of the app.
 * Can be accessed on both server and client.
 *
 * Must be implemented as a function in order for end-to-end
 * tests to handle the environment mode correctly.
 */
export function mode() {
  return {
    isDev: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test', // for vitest
    isProd: process.env.NODE_ENV === 'production',
  };
}

/**
 * Returns an object containing global app configuration based on
 * environment variables.
 *
 * We don't want the app to crash when env vars are not set correctly.
 * Therefore, we make this as a function to handle errors via error boundaries
 * (e.g. within loaders or actions).
 *
 * This should be the only place across the application where env vars are
 * accessed directly (except the `mode` from above).
 *
 * @returns global app configuration values
 * @throws {Error} on invalid configuration of env vars
 */
export default function env() {
  const { isDev, isTest, isProd } = mode();
  const errors = [];
  // APP_BASE_URL
  let appBaseUrl = process.env.APP_BASE_URL;
  if (!appBaseUrl) {
    if (isTest) {
      appBaseUrl = 'mockAppBaseUrl';
    } else if (isDev) {
      appBaseUrl = 'http://localhost:5173';
    } else {
      errors.push('`APP_BASE_URL` environment variable is missing.');
    }
  } else {
    if (!isURL(appBaseUrl, { require_tld: false })) {
      errors.push('`APP_BASE_URL` environment variable must be a valid URL.');
    } // TODO: remove `require_tld` when `isURL` supports "localhost"
  }
  // API_BASE_URL
  let apiBaseUrl = process.env.API_BASE_URL;
  if (!apiBaseUrl) {
    if (isTest) {
      apiBaseUrl = 'mockApiBaseUrl';
    } else if (isDev) {
      apiBaseUrl = 'http://localhost:3000';
    } else {
      errors.push('`API_BASE_URL` environment variable is missing.');
    }
  } else {
    if (!isURL(apiBaseUrl, { require_tld: false })) {
      errors.push('`API_BASE_URL` environment variable must be a valid URL.');
    } // TODO: remove `require_tld` when `isURL` supports "localhost"
  }
  // SESSION_COOKIE_SECRET
  let sessionCookieSecret = process.env.SESSION_COOKIE_SECRET;
  if (!sessionCookieSecret) {
    if (!isProd) {
      sessionCookieSecret = '__INSECURE__session_cookie_secret_dev';
    } else {
      errors.push('`SESSION_COOKIE_SECRET` environment variable is missing.');
    }
  }
  // ALLOW_SESSION_COOKIE_WITHOUT_HTTPS
  let allowSessionCookieWithoutHttps: boolean;
  if (!process.env.ALLOW_SESSION_COOKIE_WITHOUT_HTTPS) {
    allowSessionCookieWithoutHttps = isDev;
  } else {
    allowSessionCookieWithoutHttps =
      process.env.ALLOW_SESSION_COOKIE_WITHOUT_HTTPS === 'true';
  }
  if (isProd) {
    allowSessionCookieWithoutHttps = false;
  }
  // logging issues and throwing
  errors.map((x) => console.error(x));
  if (errors.length > 0) {
    throw new Error(
      'There have been issues with environment variables configuration (see console logs).',
    );
  }
  // returning
  return {
    appBaseUrl: appBaseUrl!, // TODO: handle `undefined` better
    apiBaseUrl: apiBaseUrl!, // TODO: handle `undefined` better
    sessionCookieSecret: sessionCookieSecret!, // TODO: handle `undefined` better
    allowSessionCookieWithoutHttps,
  };
}
