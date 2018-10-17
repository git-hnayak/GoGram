const config = {};

config.port = process.env.PORT || 4005;
config.environment = process.env.NODE_ENV || 'development';
config.secret_key = process.env.SECRET_KEY || 'Go888$77$6611$GRaM';

module.exports = config;