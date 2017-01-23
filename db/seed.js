'use strict'

const db = require('APP/db')

const seedUsers = () => db.Promise.map([
  {name: 'user1', email: 'user1@gmail.com', password: '1234'},
  {name: 'user2', email: 'user2@gmail.com', password: '1234'},
  {name: 'user3', email: 'user3@gmail.com', password: '1234'},
], user => db.model('users').create(user))

const seedItems = () => db.Promise.map([
  {name: 'item1'},
  {name: 'item2'},
  {name: 'item3'},
  {name: 'item4'},
  {name: 'item5'},
  {name: 'item6'},
], item => db.model('item').create(item))


db.didSync
  .then(() => db.sync({force: true}))
  .then(seedItems)
  .then(seedUsers)
  .then(users => console.log(`Seeded ${users.length} users OK`))
  .catch(error => console.error(error))
  .finally(() => db.close())
