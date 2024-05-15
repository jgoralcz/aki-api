# aki-api (Akinator)
[![npm version](https://badge.fury.io/js/aki-api.svg)](https://www.npmjs.com/package/aki-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Actions Status](https://github.com/jgoralcz/aki-api/workflows/unittest/badge.svg)](https://github.com/jgoralcz/aki-api/actions)

An API for Akinator based in NodeJS.


## Installation

``npm i aki-api``

### Regions
```js
 [
  'en',
  'ar',
  'cn',
  'de',
  'es',
  'fr',
  'il',
  'it',
  'jp',
  'kr',
  'nl',
  'pl',
  'pt',
  'ru',
  'tr',
  'id'
]
```


## Usage

```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const childMode = false;
    const proxy = undefined;

    const aki = new Aki({ region, childMode, proxy });
    await aki.start();
    console.log('question:', aki.question);
    console.log('answers: ', aki.answers);
}

run().catch(console.error);
```

### Output from above console.log

```bash
question: Is your character real?
answers: [  
  "Yes",
  "No",
  "Don't know",
  "Probably",
  "Probably not"
]
```

### Get regions that I support
```js
  const { regions } = require('aki-api');
  
  console.log(regions);
```


### Answer a Question (step)
```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const aki = new Aki({ region });
    
    await aki.start();

    const myAnswer = 0; // yes = 0
    
    await aki.step(myAnswer);

    console.log('question:', aki.question);
    console.log('answers:', aki.answers);
    console.log('progress:', aki.progress);
}

run().catch(console.error);
```

### Win/Show the akinator's guess
#### Akinator will automatically guess when calling the answer() method

```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const aki = new Aki({ region });
    
    const guessOrResponse = await aki.answer(); // check if it is a guess by akinator or another question
    
    // if you do not like the answer...
    await aki.continue();
}

run().catch(console.error);
```

### Enable child mode
#### Simply pass in true or false for the childMode parameter
The child mode prevents showing explicit questions.

```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const childMode = true;
    const aki = new Aki({ region, childMode });
}

run().catch(console.error);
```

### Example Code for Back
```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const aki = new Aki({ region });

    await aki.start();

    const myAnswer = 1; // no = 1

    await aki.step(myAnswer);
    await aki.back();

    console.log('question:', aki.question);
    console.log('answers:', aki.answers);
}

run().catch(console.error);
```

