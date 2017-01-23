'use strict'
const Similars_DB = require('APP/db/models/similars');
const _ = require('lodash');

class Similars {
  constructor(engine) {
    this.engine = engine;
    this.db = Similars_DB;
  }

  byUser(user) {
    return this.db.findOrCreate({ where: { user }})
      .spread((res, bool) => res.others)
  }

  update(user) {
    let itemsUserLike, itemsUserDislike, itemsOtherUsersLike, itemsOtherUsersDislike
    const queryUsers = (item) => Promise.all([
      this.engine.likes.usersByItem(item),
      this.engine.dislikes.usersByItem(item)
    ]);

    const queryItems = (user) => Promise.all([
      this.engine.likes.itemsByUser(user),
      this.engine.dislikes.itemsByUser(user)
    ]);


    Promise.all([
      this.engine.likes.itemsByUser(user),
      this.engine.dislikes.itemsByUser(user)
    ])
      .then(items => {
        itemsUserLike = items[0];//1, 3, 5
        itemsUserDislike = items[1];//none
        return queryUsers(_.uniq(_.flatten(items)))
      })
        .then(users => {
          // let otherUsersWhoLikeTheSameItems = _.without(_.uniq(_.flatten(users[0])), +user);//3
          // let otherUsersWhoDislikeTheSameItems = _.without(_.uniq(_.flatten(users[1])), +user);//2
          let others = _.without(_.uniq(_.flatten(users)), +user);
          // console.log(others);
          let othersToUpdate = [];

          others.map(other => {
            queryItems(other)
              .then(itemsWithSimilarPreference => {
                itemsOtherUsersLike = itemsWithSimilarPreference[0];
                itemsOtherUsersDislike = itemsWithSimilarPreference[1];

                const similarity = (_.intersection(itemsUserLike, itemsOtherUsersLike).length + _.intersection(itemsUserDislike, itemsOtherUsersDislike).length - _.intersection(itemsUserLike, itemsOtherUsersDislike).length - _.intersection(itemsUserDislike, itemsOtherUsersLike).length) / (_.union(itemsUserLike, itemsOtherUsersLike, itemsUserDislike, itemsOtherUsersDislike).length);
                othersToUpdate.push({ user: other, similarity });
              })
          });
          return othersToUpdate;
        })
        .then(others => {
          return this.db.findOrCreate({where: {user}})
            .spread((instance, bool) => {
              return instance.update({others});
            })
        })
        .catch(err => console.error(err));
  }
}

module.exports = Similars;
