'use strict'
const Similars_DB = require('APP/db/models/similars');
const _ = require('lodash');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = Similars_DB;
  }

  byUser(user) {
    return this.db.findOne({ where: { user } })
      .then(res => {
        if (res.others) return res.others;
      })
  }

  update(user) {
    let itemsUserLike, itemsUserDislike, itemsOtherUsersLike, itemsOtherUsersDislike;

    const queryUsers = (item) => Promise.all([
      this.engine.likes.usersByItem(item),
      this.engine.dislikes.usersByItem(item)
    ]);

    const queryItems = (user) => Promise.all([
      this.engine.likes.itemsByUser(user),
      this.engine.dislikes.itemsByUser(user)
    ]);

    return queryItems(user)
      .then(items => {
        itemsUserLike = items[0];
        itemsUserDislike = items[1];
        return queryUsers(_.uniq(_.flatten(items)));
      })
        .then(users => {
          //others: users who liked/disliked items that the user also liked/disliked NOT INCLUDING USER
          let others = _.without(_.uniq(_.flatten(users)), +user);
          let similarToOthers = [];

          others.map(other => {
            queryItems(other)
              .then(itemsOtherUsersLikeOrDislikes => {
                itemsOtherUsersLike = itemsOtherUsersLikeOrDislikes[0];
                itemsOtherUsersDislike = itemsOtherUsersLikeOrDislikes[1];

                const similarity = (_.intersection(itemsUserLike, itemsOtherUsersLike).length + _.intersection(itemsUserDislike, itemsOtherUsersDislike).length - _.intersection(itemsUserLike, itemsOtherUsersDislike).length - _.intersection(itemsUserDislike, itemsOtherUsersLike).length) / (_.union(itemsUserLike, itemsOtherUsersLike, itemsUserDislike, itemsOtherUsersDislike).length);

                similarToOthers.push({ user: other, similarity });
              })
          });
          return similarToOthers;
        })
        .then(similars => {
          // console.log(similars);
          return this.db.findOrCreate({where: {user}})
            .spread((instance, bool) => {
              return instance.update({others: similars});
            })
        })
        .catch(err => console.error(err));
  }
}

module.exports = Similars;
