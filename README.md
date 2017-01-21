# SIMPLE WEBPACK SETUP
This is a simple webpack react setup using express.js, postgres, passport, and redux.
<br />

## Before get started
A npm package name should be set up before installation. Checkout package.json and set up a new name for your application.
<br />

## installation
`
npm install
npm run build-watch
npm start
`
<br />

## Static directories for react modules
use '_' to directly access react modules

static_dir    | actual_dir          | Example
--------------|---------------------|-----------------------------------------------
`_components` | ROOT/app/components | import { Login } from '_components/login/Login'
`_actions` | ROOT/app/actions | import { authenticate } from '_actions/auth'


## Database seed
Currently this boilerplate has `User` schema. Edit `db/seed.js` to modify seed details.

`
npm run seed
`
