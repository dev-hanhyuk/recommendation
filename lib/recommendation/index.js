'use strict'

const Rater = reuiqre('./rater');
const Similars = require('./similars');
const Suggestions = require('./suggestions');

function Engine (likes, dislikes, similars, suggestions) {
  this.likes = new Rater(this, 'likes');
  this.dislikes = new Rater(this, 'dislikes');
  this.similars = new Similars(this);
  this.suggestions = new Suggestions(this);
}

module.exports = Engine;
