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
    .then(() => {
      e.similars.update(user)
      e.suggestions.update(user)
      res.sendStatus(201)
    })
    // .then(instance => res.send(instance))
    .catch(next)
  // return Likes.findOrCreate({ where: { user, item }})
  //   .then(() => this.engine.similars.update(user))
  //   .then(() => this.engine.suggestions.update(user))
  //   .catch(next)
})

api.post('/dislike', (req, res, next) => {
  const {item, user} = req.body;
  return e.dislikes.add(user, item)
    // .then(res => console.log(res))
    // .catch(next)
});

api.get('/recommendations/:user', (req, res, next) => {
  let likes, dislikes, suggestions;
  return Promise.all([ e.likes.itemsByUser(req.params.user), e.dislikes.itemsByUser(req.params.user)])
    .then(result => {
       likes = result[0];
       dislikes = result[1];
       return e.suggestions.update(req.params.user)
    })
    .then(() => {
      return e.suggestions.forUser(req.params.user)
        .then(res => suggestions = res.suggestions)
    })
    .then(() => {
      return Item.findAll()
        .then(items => {
          let s = _.map(_.sortBy(suggestions, s => -s.weight), sg => _.find(items, i => i.id == sg.item));
          // res.send({ items, user: req.params.user, likes, dislikes, suggestions: s })
          res.send({ suggestions: s})
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
