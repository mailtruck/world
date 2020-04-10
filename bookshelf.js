//connection: {
//    host: "localhost",
//    user: "mailtruck",
//    password:"secret",
//    database: "mailtruck",
//    ssl: "false",
//    charset: "utf8"
//  }
//

const environment = process.env.ENVIRONMENT || 'development'
const config = require('./knexfile.js')[environment];
var knex = require("knex")(config);
var bookshelf = require("bookshelf")(knex);

module.exports = bookshelf
