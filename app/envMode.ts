/**
 * Encapsulates environment mode for the rest of the app.
 * Can be accessed on both server and client.
 */
export default function envMode() {
  return {
    isDev: process.env.NODE_ENV === 'development',
    isProd: process.env.NODE_ENV === 'production',
  };
}
