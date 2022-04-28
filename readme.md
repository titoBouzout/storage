# Storage

A simple class to automate storage.

## Usage

```jsx
import storage from '@titodp/storage'

// saving to storage

storage.uh = 'YES' // look at storage!

storage.objectToo = { uh: 'YES', wow: '😁' } // look at storage!

// deleting from storage

delete storage.uh

// fancy example

// start with default values
let mySettings = {
	uh: 'YES',
	wow: '😁',
}

// load any setting that has been saved previously
// and put it on mySettings
mySettings = storage.on(mySettings, 'optional key prefix')

// first time you run this code should show 😁 (the default)
// if you reload it, it should show 🥳 as we saved a new value on the next example
console.log(mySettings.wow)

// change the value and save it to storage
mySettings.wow = '🥳'

// reset with mySettings.reset()
```

## Install

`npm install @titodp/storage`

## How it works?

It sets a proxy trap, serializes when you set and unserializes when you get.

## Author

- https://github.com/titoBouzout

## URL

- https://github.com/titoBouzout/storage
- https://www.npmjs.com/package/@titodp/storage
