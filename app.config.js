require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.praful.djapp',
  },
  extra: {
    ...config.extra,
    DEFAULT_OPENAI_KEY: process.env.DEFAULT_OPENAI_KEY || process.env.OPENAI_API_KEY || '',
  },
});
