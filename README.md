# aki-api (based off of the akinator-api which did not seem to get updates)
<!-- [![npm version](https://badge.fury.io/js/akinator-api.svg)](https://badge.fury.io/js/akinator-api) -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An api for Akinator based in NodeJS.

This package has many features that you may use to interact with the Akinator api.
Below you will find information on how to install the package + the package's features.
This package supports 15 different languages.

## Requirements
| Requirement | Version |
| ---|---|
| Node | ^8.8.0 |
| NPM | ^5.5.1 |


## Installation

``npm i aki-api``


## Usage

### Start A Game

#### Sample JSON Response

```json
{  
   "session":"20",
   "signature":"793609611",
   "question":"Is your character's gender female?",
   "answers":[  
      "Yes",
      "No",
      "Don't know",
      "Probably",
      "Probably not"
   ]
}
```

#### Example Code for Start using callbacks

```js
const aki = require('aki-api');

aki.start(region, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(gamedata);
  }
});
```

#### Example Code for Start using promises

```js
const aki = require('aki-api');

const data = await aki.start(region);
```


### Answer a Question

#### Sample JSON Response

```json
{  
   "nextQuestion":"Is your character a youtuber?",
   "progress":"2.05700",
   "answers":[  
      "Yes",
      "No",
      "Don't know",
      "Probably",
      "Probably not"
   ]
}
```

#### Example Code for Answer using callbacks

```js
const aki = require('aki-api');

aki.answer(region, session, signature, answerid, step, (next, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(next);
  }
});
```

#### Example Code for Answer using promises

```js
const aki = require('aki-api');

const nextInfo = await aki.answer(region, session, signature, answerid, step);
```

#### Example Code for Win using callbacks

```js
const aki = require('aki-api');

aki.win(region, session, signature, step, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(gamedata);
  }
});
```

#### Example Code for Win using promises

```js
const aki = require('aki-api');

const win = await aki.win(region, session, signature, step);
```

#### Example Code for Cancel using callbacks (goes back to previous step; manage this on your own)

```js
const aki = require('aki-api');

aki.cancel(region, session, signature, answerid, step, (next, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(next);
  }
});
```


#### Example Code for Cancel using promises (goes back to previous step; manage this on your own)

```js
const aki = require('aki-api');

const previousStep = await aki.cancel(region, session, signature, answerid, step);
```

