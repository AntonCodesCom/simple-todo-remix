/**
 * Encapsulates environment mode for the rest of the app.
 * Can be accessed on both server and client.
 */
const envMode = {
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

export default envMode;
