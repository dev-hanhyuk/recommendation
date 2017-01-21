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

User.belongsToMany(Item, {through: Likes});
Item.belongsToMany(User,{through: Likes} )
User.belongsToMany(Item, {through: Dislikes});
Item.belongsToMany(User, {through: Dislikes});
Similars.belongsTo(User);
Suggestions.belongsTo(User);

module.exports = { User, Likes, Dislikes, Similars, Suggestions, Item };
