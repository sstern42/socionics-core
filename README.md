# socionics-core

Canonical socionics data and query library. Covers all 16 types, 15 intertype relations, 8 functions, quadras, clubs and temperaments — structured for use in any JavaScript project.

No dependencies. No build step. Works in Node.js 12+.

```bash
npm install socionics-core
```

---

## Quick start

```js
const socionics = require('socionics-core');

// Get a type
const lii = socionics.getType('LII');
console.log(lii.name);       // 'The Analyst'
console.log(lii.mbti);       // 'INTj'
console.log(lii.quadra);     // 'Alpha'
console.log(lii.functions[0].code); // 'Ti' (Leading)
console.log(lii.functions[4].code); // 'Fe' (Suggestive)

// Get the relation between two types
const rel = socionics.getRelation('LII', 'ESE');
console.log(rel.name);        // 'Dual'
console.log(rel.orientation); // 'Hetroverted'
console.log(rel.rhythm);      // 'Rhythmic'
console.log(rel.vibe);        // 'Attractive'

// Asymmetric relations include direction
const ben = socionics.getRelation('ILE', 'EIE');
console.log(ben.name);                  // 'Benefaction'
console.log(ben.direction.benefactor);  // 'ILE'
console.log(ben.direction.beneficiary); // 'EIE'

// Look up by MBTI equivalent
const ile = socionics.getTypeByMbti('ENTp');
console.log(ile.code); // 'ILE'

// Get quadra, club, temperament — by type code or group name
socionics.getQuadra('LII');       // Alpha quadra object
socionics.getClub('Researcher');  // Researcher club object
socionics.getTemperament('IJ');   // IJ temperament object
```

---

## API

### Types

#### `getType(code)` → object
Returns the full type object for a socionics code. Case-insensitive.

```js
getType('LII')  // or 'lii', 'Lii'
```

**Type object shape:**
```js
{
  code: 'LII',
  name: 'The Analyst',
  mbti: 'INTj',
  quadra: 'Alpha',
  club: 'Researcher',
  temperament: 'IJ',
  extraversion: false,
  rationality: 'Rational',
  romanceStyle: 'Infantile',
  communicationStyle: 'Cool',
  stimulus: 'Confident',
  argumentation: 'Constructor',
  functions: [
    { position: 1, block: 'Ego',       role: 'Leading',      code: 'Ti' },
    { position: 2, block: 'Ego',       role: 'Creative',     code: 'Ne' },
    { position: 3, block: 'Super-ego', role: 'Role',         code: 'Fi' },
    { position: 4, block: 'Super-ego', role: 'Vulnerable',   code: 'Se' },
    { position: 5, block: 'Super-id',  role: 'Suggestive',   code: 'Fe' },
    { position: 6, block: 'Super-id',  role: 'Mobilising',   code: 'Si' },
    { position: 7, block: 'Id',        role: 'Ignoring',     code: 'Te' },
    { position: 8, block: 'Id',        role: 'Demonstrative','code': 'Ni' }
  ]
}
```

#### `getAllTypes()` → object[]
Returns all 16 type objects as an array.

#### `getTypeByMbti(mbti)` → object | null
Looks up a type by its MBTI equivalent (e.g. `'INTj'`). Returns `null` if not found.

---

### Functions

#### `getFunction(code)` → object
Returns the function object for a code (`'Ne'`, `'Ti'`, `'Fe'` etc).

```js
{
  code: 'Ne',
  name: 'Extraverted Intuition',
  attitude: 'Extraverted',
  domain: 'Intuition',
  slide: 'Creative Thinking',
  description: 'Noticing trends and possibilities in a reality filled with unknown opportunities'
}
```

The `slide` field is the SLIDE attitude name — a secondary descriptive label for each function used in socionics theory.

#### `getAllFunctions()` → object[]
Returns all 8 function objects as an array.

---

### Relations

#### `getRelation(typeA, typeB)` → object
Returns the intertype relation between two types. Handles both directions of asymmetric relations (benefaction, supervision) automatically.

**Relation object shape:**
```js
{
  relation: 'dual',        // camelCase relation key
  name: 'Dual',            // display name
  from: 'LII',
  to: 'ESE',
  orientation: 'Hetroverted',  // or 'Monoverted'
  rhythm: 'Rhythmic',          // or 'Arrhythmic'
  vibe: 'Attractive',          // or 'Repulsive'
  symmetry: 'Symmetrical',     // or 'Asymmetrical'
  description: '...'
}
```

For asymmetric relations a `direction` field is added:
```js
// getRelation('ILE', 'EIE')
{
  relation: 'benefaction',
  direction: { benefactor: 'ILE', beneficiary: 'EIE' },
  ...
}

// getRelation('ILE', 'LSI')
{
  relation: 'supervision',
  direction: { supervisor: 'ILE', supervisee: 'LSI' },
  ...
}
```

#### `getRelationsFor(code)` → object[]
Returns all 16 intertype relation objects for a given type (including identity).

#### `getTypesByRelation(code, relationName)` → object[]
Returns the type(s) that share a given relation with the specified type.

```js
getTypesByRelation('LII', 'dual')     // [ESE type object]
getTypesByRelation('LII', 'conflict') // [SEE type object]
getTypesByRelation('LII', 'benefaction') // [IEI, SLI type objects]
```

---

### Groups

#### `getQuadra(codeOrName)` → object
Accepts a type code (`'LII'`) or quadra name (`'Alpha'`).

```js
{
  name: 'Alpha',
  types: ['ILE', 'LII', 'ESE', 'SEI'],
  mbti: ['ENTp', 'INTj', 'ESFj', 'ISFp'],
  theme: 'Reflecting and delighting in',
  dualStyle: 'Careful-Infantile',
  lifeStage: 'Childhood',
  valuedFunctions: ['Ne', 'Ti', 'Fe', 'Si'],
  description: '...'
}
```

#### `getClub(codeOrName)` → object
Accepts a type code or club name (`'Researcher'`, `'Socializer'`, `'Pragmatist'`, `'Humanitarian'`).

#### `getTemperament(codeOrName)` → object
Accepts a type code or temperament code (`'EP'`, `'EJ'`, `'IP'`, `'IJ'`).

#### `getAllGroups()` → object
Returns the raw groups data containing all quadras, clubs and temperaments.

---

### Raw data access

```js
const { data } = require('socionics-core');
data.types     // all 16 type objects keyed by code
data.relations // byType lookup + relation metadata
data.functions // all 8 function objects keyed by code
data.groups    // quadras, clubs, temperaments
```

---

## The 16 types

| Code | Name | MBTI | Quadra |
|------|------|------|--------|
| ILE | The Searcher | ENTp | Alpha |
| LII | The Analyst | INTj | Alpha |
| ESE | The Enthusiast | ESFj | Alpha |
| SEI | The Mediator | ISFp | Alpha |
| EIE | The Actor | ENFj | Beta |
| IEI | The Romantic | INFp | Beta |
| SLE | The Marshal | ESTp | Beta |
| LSI | The Inspector | ISTj | Beta |
| SEE | The Ambassador | ESFp | Gamma |
| ESI | The Guardian | ISFj | Gamma |
| LIE | The Pioneer | ENTj | Gamma |
| ILI | The Critic | INTp | Gamma |
| IEE | The Psychologist | ENFp | Delta |
| EII | The Humanist | INFj | Delta |
| LSE | The Director | ESTj | Delta |
| SLI | The Craftsman | ISTp | Delta |

---

## The 16 intertype relations

| Relation | Orientation | Rhythm | Vibe | Symmetry |
|----------|-------------|--------|------|----------|
| Dual | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Activation | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Mirror | Hetroverted | Arrhythmic | Repulsive | Symmetrical |
| Kindred | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Semi-dual | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Business | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Mirage | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Quasi-identity | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Extinguishment | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Super-ego | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Identity | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Conflict | Hetroverted | Arrhythmic | Repulsive | Symmetrical |
| Benefaction | Monoverted | Arrhythmic | Attractive | **Asymmetrical** |
| Supervision | Hetroverted | Arrhythmic | Repulsive | **Asymmetrical** |

---

## Background

Socionics is a theory of personality and interpersonal relations developed by Aušra Augustinavičiūtė in the 1970s, building on Carl Jung's work on psychological types. It shares the familiar 16-type structure with MBTI but takes a different road — the function ordering differs, and the intertype relations system has no MBTI equivalent.

For human-readable explanations of every type, function and relation, see **[socionicsinsight.com](https://www.socionicsinsight.com)**.

For a plain-English introduction to socionics, see the *Socionics Made Simple* Kindle series: [amazon.com/dp/B0XXXXX](https://amzn.to/4rDcbmW).

---

## Contributing

Corrections, additional attributes, and translations are welcome. Please open an issue before submitting a PR for anything beyond a data fix.

## Licence

MIT
