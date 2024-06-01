/**
 * Encapsulates environment mode for the rest of the app.
 * Can be accessed on both server and client.
 */
export function envModeFactory() {
  return {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
}

/**
 * Encapsulates environment mode for the rest of the app.
 * Can be accessed on both server and client.
 *
 * @deprecated
 * @use `envModeFactory()`
 */
const envMode = envModeFactory();

export default envMode;
