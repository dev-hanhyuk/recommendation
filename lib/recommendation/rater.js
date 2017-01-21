'use strict'
const async = require('async');
const Likes = require('APP/db/models/likes');
const Dislikes = require('APP/db/models/dislikes');
const _ = require('lodash');

class Rater {
  constructor(engine, kind) {
    this.engine = engine;
    this.kind = kind;
    this.db = this.kind == 'likes' ? Likes : Dislikes;
  }

  add = (user, item) => {
    this.db.findOne({ where: { user, item }})
      .then(res => {
        if (res) return;
        return this.db.create({ user, item })
      })
      .then(() => this.engine.similars.update(user))
      .then(() => this.engine.suggestions.update(user))
  }

  remove = (user, item) => {
    return this.db.findAll({ where: {user, item} })
      .then(instance => instance.destroy())
      .then(() => async.series(
        [
          () => this.engine.similars.update(user),
          () => this.engine.suggestions.update(user)
        ]))
  }

  itemsByUser = (user) => {
    this.db.findAll({ where: {user} })
      .then(preferences => {
        console.log(preferences);
        _.map(preferences, 'item')
      });
  }

  usersByItem = (item) => {
    return this.db.find({ where: {item} })
      .then(preferences => _.map(preferences, 'user'))
  }
}

module.exports = Rater;