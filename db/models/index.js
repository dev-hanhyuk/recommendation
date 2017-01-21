'use strict';

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('User')
// to get access to the User model.

const User = require('./user');
const Likes = require('./likes');
const Dislikes = require('./dislikes');
const Similars = require('./similars');
const Suggestions = require('./suggestions');
const Item = require('./item');

User.belongsToMany(Item, {through: Likes, foreignKey: 'user'});
Item.belongsToMany(User,{through: Likes, foreignKey: 'item'} )
User.belongsToMany(Item, {through: Dislikes, foreignKey: 'user'});
Item.belongsToMany(User, {through: Dislikes, foreignKey: 'item'});
User.hasOne(Similars, {foreignKey: 'user'});
User.hasOne(Suggestions, {foreignKey: 'user'});

module.exports = { User, Likes, Dislikes, Similars, Suggestions, Item };
