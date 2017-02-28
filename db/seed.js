'use strict'

const db = require('APP/db')

const seedUsers = () => db.Promise.map([
  {id: 1, name: 'user1', email: 'user1@gmail.com', password: '1234'},
  {id: 2, name: 'user2', email: 'user2@gmail.com', password: '1234'},
  {id: 3, name: 'user3', email: 'user3@gmail.com', password: '1234'},
  {id: 4, name: 'user4', email: 'user4@gmail.com', password: '1234'},
], user => db.model('users').create(user))

const seedItems = () => db.Promise.map([
  {name: "The Hobbit: The Battle of the Five Armies", thumbnail: "http://upload.wikimedia.org/wikipedia/en/0/0e/The_Hobbit_-_The_Battle_of_the_Five_Armies.jpg"},
  {name: "Guardians of the Galaxy", thumbnail: "http://upload.wikimedia.org/wikipedia/en/8/8f/GOTG-poster.jpg"},
  {name: "Maleficent", thumbnail: "http://upload.wikimedia.org/wikipedia/en/5/55/Maleficent_poster.jpg"},
  {name: "X-Men: Days of Future Past", thumbnail: "http://upload.wikimedia.org/wikipedia/en/0/0c/X-Men_Days_of_Future_Past_poster.jpg"},
  {name: "Captain America: The Winter Soldier", thumbnail: "http://upload.wikimedia.org/wikipedia/en/e/e8/Captain_America_The_Winter_Soldier.jpg"},
  {name: "The Hunger Games: Mockingjay - Part 1", thumbnail: "http://upload.wikimedia.org/wikipedia/en/6/63/MockingjayPart1Poster3.jpg"},
  {name: "The Amazing Spider-Man 2", thumbnail: "http://upload.wikimedia.org/wikipedia/en/0/02/The_Amazing_Spiderman_2_poster.jpg"},
  {name: "Dawn of the Planet of the Apes", thumbnail: "http://upload.wikimedia.org/wikipedia/en/7/77/Dawn_of_the_Planet_of_the_Apes.jpg"},
  {name: "Interstellar", thumbnail: "http://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"},
], item => db.model('item').create(item))


db.didSync
  .then(() => db.sync({force: true}))
  .then(seedItems)
  .then(items => console.log(`Seeded ${items.length} items OK`))
  .then(seedUsers)
  .then(users => console.log(`Seeded ${users.length} users OK`))
  .catch(error => console.error(error))
  .finally(() => db.close())
