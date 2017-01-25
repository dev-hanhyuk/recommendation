'use strict'
const db = require('APP/db');
const _ = require('lodash');
const User = db.model('users');
const Item = db.model('item');
const Likes = db.model('likes');
const Dislikes = db.model('dislikes');
const api = module.exports = require('express').Router();
const R = require('APP/lib/recommendation');
const e = new R;


api.get('/items', (req, res, next) => {
  Item.findAll()
    .then(items => res.send(items))
    .catch(next)
})

api.post('/user/login', (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: {email} })
    .then(user => {
      if(user.authenticate(password)) res.send(user);
      else throw new Error('authenticate error')
    })
    .catch(next)
})


api.post('/like', (req, res, next) => {
  const {item, user} = req.body;
  return e.likes.add(user, item)
    .then(instance => {
      console.log(instance);
      res.send(instance)
    })
    .catch(next)
  // return Likes.findOrCreate({ where: { user, item }})
  //   .then(() => this.engine.similars.update(user))
  //   .then(() => this.engine.suggestions.update(user))
  //   .catch(next)
})

api.post('/dislike', (req, res, next) => {
  const {item, user} = req.body;
  return e.dislikes.add(user, item)
    .then(res => console.log(res))
    .catch(next)
});

api.get('/recommendations/:user', (req, res, next) => {
  Promise.all([
    e.likes.itemsByUser(req.params.user),
    e.dislikes.itemsByUser(req.params.user),
    e.suggestions.update(req.params.user),
    e.suggestions.forUser(req.params.user)
  ])
    .then(result => {
      let likes = result[0];
      let dislikes = result[1];
      let suggestions = result[3].suggestions;

      return Item.findAll()
        .then(items => {
          let s = _.map(_.sortBy(suggestions, s => -s.weight), sg => _.find(items, i => i.id == sg.item));
          res.send({ items, user: req.params.user, likes, dislikes, suggestions: s })
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
