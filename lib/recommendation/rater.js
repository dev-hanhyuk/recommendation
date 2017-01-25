'use strict'
const Likes = require('APP/db/models/likes');
const Dislikes = require('APP/db/models/dislikes');
const _ = require('lodash');

class Rater {
  constructor(engine, kind) {
    this.engine = engine;
    this.kind = kind;
    this.db = this.kind == 'likes' ? Likes : Dislikes;
  }

  add(user, item) {
    this.db.findOrCreate({ where: { user, item }})
      .then(() => this.engine.similars.update(user))
      .then(() => this.engine.suggestions.update(user))
      .catch(err => console.error(err))
  }

  remove(user, item) {
    return this.db.findOne({ where: { user, item } })
      .then(res => res.destroy())
      .then(() => this.engine.similars.update(user))
      .then(() => this.engine.suggestions.update(user))
  }

  itemsByUser(user) {
    return this.db.findAll({ where: { user } })
      .then(res => _.map(res, 'item'));
  }

  usersByItem(item) {
    return this.db.findAll({ where: { item } })
      .then(res => _.map(res, 'user'))
  }
}

module.exports = Rater;