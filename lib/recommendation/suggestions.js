'use strict'
const _ = require('lodash');
const async = require('async');
const Suggestions_DB = require('APP/db/models/suggestions');


class Suggestions {
  constructor(engine) {
    this.engine = engine;
    this.db = Suggestions_DB;
  }

  forUser(user) {
    return this.db.findOne({ where: {user} })
  }

  update(user) {
    let items = [];
    let userItems = [];
    let suggestions = [];
    let likers = [];
    let dislikers = [];

    return Promise.all([
      this.engine.likes.itemsByUser(user),
      this.engine.dislikes.itemsByUser(user),
    ])
      .then(res => userItems = _.flatten(res))
      .then(() => {
        return this.engine.similars.byUser(user)
      })
      .then(others => {
        //The method begins by listing all the users similar to the given user, and all the items the given user has not rated
        const gettingOtherLikeItems = others.map(other => this.engine.likes.itemsByUser(other.user));
        const gettingOtherDislikeItems = others.map(other => this.engine.dislikes.itemsByUser(other.user));

        return Promise.all(gettingOtherLikeItems)
          .then(res => items.push(res))
          .then(() => Promise.all(gettingOtherDislikeItems))
          .then(res => items.push(res))
          .then(() => others)
      })
      .then((others) => {
        //among items => we should remove items that the user already liked/disliked
        items = _.difference(_.uniq(_.flatten(_.flatten(items))), userItems);

        _.map(items, (item) => {
          return Promise.all([
            this.engine.likes.usersByItem(item),
            this.engine.dislikes.usersByItem(item)
          ])
            .then(res => {
              likers = res[0];
              dislikers = res[1];
              let numerator = 0;
              let otherUsers = _.without(_.flatten([likers, dislikers]), +user);

              otherUsers.map(otherUser => {
                let other = _.find(others, {user: otherUser});
                numerator += other.similarity;
              });

              // console.log('\nNUMERATOR: ', numerator, '\nALL OTHER USERS: ', otherUsers.length);
              suggestions.push({item, weight: numerator / otherUsers.length});
              return suggestions;
            })
            .then((suggestions) => {
              return this.db.findOrCreate({ where: {user} })
                .spread((instance, bool) => {
                  return instance.update({suggestions})
                })
            })
            .catch(err => console.error(err))
        })
      })
  }
}

module.exports = Suggestions;
