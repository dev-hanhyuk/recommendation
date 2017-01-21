'use strict'
const Sequelize = require('sequelize')
const db = require('APP/db')

const Similars = db.define('similars', {
  others: Sequelize.ARRAY(Sequelize.JSON)
});



module.exports = Similars;