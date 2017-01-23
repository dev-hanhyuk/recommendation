'use strict'
const db = require('APP/db');
const _ = require('lodash');
const Item = db.model('item');
const Likes = db.model('likes');
const Dislikes = db.model('dislikes');
const api = module.exports = require('express').Router();
const R = require('APP/lib/recommendation');
const e = new R;


api.post('/like', (req, res, next) => {
  const {item, user} = req.body;
  Likes.findOrCreate({where: { item, user } })
    .spread((instance, created) => {
      console.log(created, instance);
      // if(!created) instance.destroy();
      return res.redirect('/api/refresh/' + user);
    })
    .catch(next);
})

api.post('/dislike', (req, res, next) => {
  const {item, user} = req.body;
  Dislikes.findOrCreate({where: { item, user } })
    .spread((instance, created) => {
      console.log(created, instance);
      return res.redirect('/api/refresh/' + user);
    })
    .catch(next)
});


api.get('/update/:user', (req, res, next) => {
  Promise.all([
    e.similars.update(req.params.user),
    e.suggestions.update(req.params.user)
  ])
    .then(() => {
      res.redirect('/api/recommendation/' + req.params.user)
    })
    .catch(next)
})



api.get('/recommendation/:user', (req, res, next) => {
  Promise.all([
    e.likes.itemsByUser(req.params.user),
    e.dislikes.itemsByUser(req.params.user),
    e.suggestions.forUser(req.params.user)
  ])
    .then(result => {
      let likes = result[0];
      let dislikes = result[1];
      let suggestions = result[2].suggestions;

      return Item.findAll()
        .then(items => {
          let s = _.map(_.sortBy(suggestions, s => -s.weight), sg => _.find(items, i => i.id == sg.item));
          res.send({ items, user: req.params.user, likes, dislikes, suggestions: s.slice(0, 5) })
        })
    })
    .catch(next)
})



// Send along any errors
api.use((err, req, res, next) => {
  res.status(500).send(err)
})

// No routes matched? 404.
api.use((req, res) => res.status(404).end())
