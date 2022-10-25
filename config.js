require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3001,
    DIR: __dirname,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SECRET_KEY: process.env.SECRET_KEY,
    KEYROCK_ADMIN_USER: process.env.KEYROCK_ADMIN_USER,
    KEYROCK_ADMIN_PASSWORD: process.env.KEYROCK_ADMIN_PASSWORD,   
}