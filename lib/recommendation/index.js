'use strict'

const Rater = require('./rater');
const Similars = require('./similars');
const Suggestions = require('./suggestions');

function RecommendationEngine (likes, dislikes, similars, suggestions) {
  this.likes = new Rater(this, 'likes');
  this.dislikes = new Rater(this, 'dislikes');
  this.similars = new Similars(this);
  this.suggestions = new Suggestions(this);
}

module.exports = RecommendationEngine;
