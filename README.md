# aki-api (Akinator)
[![npm version](https://badge.fury.io/js/aki-api.svg)](https://www.npmjs.com/package/aki-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Actions Status](https://github.com/jgoralcz/aki-api/workflows/unittest/badge.svg)](https://github.com/jgoralcz/aki-api/actions)

An API for Akinator based in NodeJS.

## Requirements
| Requirement | Version |
| ---|---|
| Node | ^8.2.1 |
| NPM | ^5.3.0 |


## Installation

``npm i aki-api``

### Regions
```js
 [
  'en',
  'en_objects',
  'en_animals',
  'ar',
  'cn',
  'de',
  'de_animals',
  'es',
  'es_animals',
  'fr',
  'fr_objects',
  'fr_animals',
  'il',
  'it',
  'it_animals',
  'jp',
  'jp_animals',
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
#### To determine a win use the `progress` property. I like to do something like `if(aki.progress >= 70)` or check the current step against the max of 80

```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const aki = new Aki({ region });
    
    await aki.start();

    const myAnswer = 0; // yes = 0

    await aki.step(myAnswer);

    if (aki.progress >= 70 || aki.currentStep >= 78) {
      await aki.win();
      console.log('firstGuess:', aki.answers);
      console.log('guessCount:', aki.guessCount);
    }
}

run().catch(console.error);
```

### Enable child mode
#### Simply pass in true or false for the 2nd parameter in the constructor.
The child mode prevents showing explicit questions. However, the results (from `aki.win()`) will still contain characters that do contain NSFW (non-child mode content). To check if the images contain NSFW content, you need to check for a property called nsfw which will be true or false (this can be inaccurate to some degree) or filter by the property `pseudo`. The `pseudo` property is a string that marks NSFW content with an `'X'` or other NSFW term to describe the character. When child mode is enabled on the site and a NSFW character is guessed, Akinator says, "I know who you are thinking of, but I believe this is not for young people".

```js
const { Aki } = require('aki-api');

const run = async () => {
    const region = 'en';
    const childMode = true;
    const aki = new Aki({ region, childMode });
    
    await aki.start();

    const myAnswer = 0; // yes = 0

    await aki.step(myAnswer);

    if (aki.progress >= 70 || aki.currentStep >= 78) {
      await aki.win();
      console.log('firstGuess:', aki.answers);
      console.log('guessCount:', aki.guessCount);
    }
}

run().catch(console.error);
```

### Output from above console.log

```json
firstGuess: [
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
]

guessCount: 2
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

