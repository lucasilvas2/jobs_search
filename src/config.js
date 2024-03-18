const dotenv = require('dotenv');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');

dotenv.config({
    path: envPath,
});

module.exports = {
    BASE_URL_LINKEDIN: process.env.BASE_URL_LINKEDIN,
    EMAIL_LINKEDIN: process.env.EMAIL_LINKEDIN,
    PASSWORD_LINKEDIN: process.env.PASSWORD_LINKEDIN,
    STRING_SEARCH_LINKEDIN: process.env.STRING_SEARCH_LINKEDIN
}