# angular2-quickstart

This tiny repo is done according to angular2 quickstart guide
just to show how simple it is to use angular2 with 3rd party ng2-* modules
like this one: https://github.com/valor-software/ng2-bootstrap

# Quick start

Clone this repo
`npm i` and `npm start` and you are ready!

## How to add ng2-bootstrap to your project
Add `map` for `moment.js` and `ng2-bootstrap` in system.js config
  ```js
    'moment': 'node_modules/moment/moment.js',
    'ng2-bootstrap/ng2-bootstrap': 'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
  ```
Done

Good luck with angular2 hacking!
