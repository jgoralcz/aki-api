# aki-api (AKINATOR)
[![CircleCI](https://circleci.com/gh/jgoralcz/aki-api/tree/master.svg?style=svg)](https://circleci.com/gh/jgoralcz/aki-api/tree/master)
[![npm version](https://badge.fury.io/js/aki-api.svg)](https://www.npmjs.com/package/aki-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An API for Akinator based in NodeJS.

This package contains all the features that you will need to interact with the Akinator API.
Below you will find information on how to install the package and utilize the package's features.
This package supports 15 different languages.

## Requirements
| Requirement | Version |
| ---|---|
| Node | ^8.2.1 |
| NPM | ^5.3.0 |


## Installation

``npm i aki-api``

### Regions (en2 is another English server that Akinator supports; use if 'en' ever goes down)
```
 ['en', 'en2', 'ar', 'cn', 'de', 'es', 'fr', 'il', 'it', 'jp', 'kr', 'nl', 'pl', 'pt', 'ru', 'tr']
```


## Usage

#### Example Code for Start using callbacks

```js
const aki = require('aki-api');

aki.start(region, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(resolve);
  }
});
```

#### Example Code for Start using promises

```js
const aki = require('aki-api');

const data = await aki.start(region);
```

### Sample for Starting A Game

```json
{  
   "session":"5",
   "signature":"628302187",
   "question":"Is your character real?",
   "answers":[  
      "Yes",
      "No",
      "Don't know",
      "Probably",
      "Probably not"
   ]
}
```


### Answer a Question (step)

#### Example Code for Step using callbacks

```js
const aki = require('aki-api');

aki.step(region, session, signature, answerId, step, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(resolve);
  }
});
```

#### Example Code for Step using promises

```js
const aki = require('aki-api');

const nextInfo = await aki.step(region, session, signature, answerId, step);
```

#### Sample JSON Response

```json
{  
   "nextQuestion":"Is your character a girl?",
   "progress":"7.76009",
   "answers":[  
      "Yes",
      "No",
      "Don't know",
      "Probably",
      "Probably not"
   ],
   "currentStep": 0,
   "nextStep": 1
}
```

### Win/Show the akinator's guess
#### To determine a win use the `progress` attribute. I like to do something like `if(nextInfo.progress >= 85)`

#### Example Code for Win using callbacks

```js
const aki = require('aki-api');

aki.win(region, session, signature, step, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(resolve);
  }
});
```

#### Example Code for Win using promises

```js
const aki = require('aki-api');

const win = await aki.win(region, session, signature, step);

//example on getting akinator answers
const firstGuess = win.answers[0].name;
```

### Example JSON response

```json
{
  "answers": 
  [
    {
      "id": "78924",
      "name": "YoRHa No.2 Type B \/ 2B",
      "id_base": "9241962",
      "proba": "0.953825",
      "description": "NieR: Automata",
      "valide_contrainte": "1",
      "ranking": "1678",
      "minibase_addable": "0",
      "relative_id": "-1",
      "pseudo": "TitansBane",
      "picture_path": "partenaire\/b\/9241962__1967810663.jpg",
      "flag_photo": "2",
      "absolute_picture_path": "http:\/\/photos.clarinea.fr\/BL_25_en\/600\/partenaire\/b\/9241962__1967810663.jpg"
    },
    {
      "id": "85376",
      "name": "2B",
      "id_base": "11509417",
      "proba": "0.0286481",
      "description": "NieR: Automata",
      "valide_contrainte": "1",
      "ranking": "25597",
      "minibase_addable": "0",
      "relative_id": "-1",
      "pseudo": "2BIsMyWaifu",
      "picture_path": "partenaire\/o\/11509417__321330868.jpg",
      "flag_photo": "2",
      "absolute_picture_path": "http:\/\/photos.clarinea.fr\/BL_25_en\/partenaire\/o\/11509417__321330868.jpg"
    }
  ],
  "currentStep": 18,
  "nextStep": 19,
  "guessCount": 2
};
```



#### Example Code for Back using callbacks (goes back to previous step; manage this on your own)

```js
const aki = require('aki-api');

aki.back(region, session, signature, answerId, step, (resolve, error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(resolve);
  }
});
```


#### Example Code for Back using promises (goes back to previous step; manage this on your own)

```js
const aki = require('aki-api');

const previousStep = await aki.back(region, session, signature, answerId, step);

//getting info from back
const question = previousStep.nextQuestion;
```

#### Example JSON response

```json
{
  "nextQuestion": "Is your character a female?",
  "progress": "2.43520",
  "answers": [ "Yes", "No", "Don't know", "Probably", "Probably not" ],
  "currentStep": 2,
  "nextStep": 1 
}
```

