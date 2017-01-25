'use strict'
const Sequelize = require('sequelize')
const db = require('APP/db')

const Item = db.define('item', {
  name: Sequelize.STRING,
  thumbnail: Sequelize.STRING
});



module.exports = Item;