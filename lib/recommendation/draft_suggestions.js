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
    let items;
    let suggestions = [];

    this.engine.similars.byUser(user)
      .then(others => {
        //others => [{user: 4, similarity: 0,5}, {user: 1, similarity: 0.3333}]

        const queryItems = (other) => Promise.all([
          this.engine.likes.itemsByUser(other),
          this.engine.dislikes.itemsByUser(other)
        ]);

        others.map(other => queryItems(other.user).then(otherItems => {
          console.log(otherItems);
          items = otherItems
        }))

        Promise.all([
          this.engine.likes.itemsByUser(user),
          this.engine.dislikes.itemsByUser(user),
        ])
          .then(res => {
            //The method begins by listing all the users similar to the given user, and all the items the given user has not rated
            let likes = res[0];
            let dislikes = res[1];
            items = _.difference(_.uniq(_.flatten(items)));

            items.map(item => {
              Promise.all([
                this.engine.likes.usersByItem(item),
                this.engine.dislikes.usersByItem(item)
              ])
                .then(res => {
                  //likers and dislikers for EACH ITEM
                  let likers = res[0];
                  let dislikers = res[1];
                  let numerator = 0;
                  let otherUsers = _.without(_.flatten([likers, dislikers]), +user);

                  for (let i in otherUsers) {
                    let other = _.find(others, o => o.user == otherUsers[i]);
                    if (other) { numerator += other.similarity; }
                    suggestions.push({item, weight: numerator / _.union(likers, dislikers).length});
                  }
                  return suggestions;
                })
                .then((suggestions) => {
                  // console.log(user, suggestions);
                  return this.db.findOrCreate({ where: {user} })
                    .spread((instance, bool) => {
                      return instance.update({ suggestions });
                    })
                })
                .catch(err => console.error(err));
            })

          })
      })
  }
}

module.exports = Suggestions;