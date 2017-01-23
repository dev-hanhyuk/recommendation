'use strict'
const Sequelize = require('sequelize')
const db = require('APP/db')

const Suggestions = db.define('suggestions', {
  suggestions: Sequelize.ARRAY(Sequelize.JSON)
}, {
  indexes: [{fields: ['user'], unique: true,}],
});



module.exports = Suggestions;