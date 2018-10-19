const config = {};

config.port = process.env.PORT || 4005;
config.environment = process.env.NODE_ENV || 'development';
config.secret_key = process.env.SECRET_KEY || 'goGramAK47Secret';

module.exports = config;