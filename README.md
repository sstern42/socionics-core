# socionics-core

Canonical socionics data and query library. Covers all 16 types, 16 intertype relations, 8 functions, 15 dichotomies, quadras, clubs and temperaments — structured for use in any JavaScript project.

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
  dichotomies: {
    extraversionIntroversion: 'Introverted',
    intuitionSensing: 'Intuitive',
    logicEthics: 'Logical',
    rationalityIrrationality: 'Rational',
    staticDynamic: 'Static',
    processResult: 'Result',
    positivistNegativist: 'Negativist',
    aristocraticDemocratic: 'Democratic',
    constructivistEmotivist: 'Emotivist',
    judiciousDecisive: 'Judicious',
    carefreeFarsighted: 'Farsighted',
    yieldingObstinate: 'Obstinate',
    askingDeclaring: 'Asking',
    tacticalStrategic: 'Strategic',
    subjectivistObjectivist: 'Subjectivist'
  },
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

### Dichotomies

The four Jungian dichotomies and Reinin's eleven, fifteen in all. Every type carries its pole on each one under `type.dichotomies`, keyed by dichotomy id.

#### `getDichotomy(idOrPole)` → object
Accepts a dichotomy id (`'staticDynamic'`) or either pole name (`'Static'`, `'dynamic'`). Case-insensitive.

```js
{
  id: 'staticDynamic',
  name: 'Static / Dynamic',
  kind: 'reinin',
  poles: ['Static', 'Dynamic'],
  product: ['extraversionIntroversion', 'rationalityIrrationality']
}
```

`product` names the Jungian dichotomies this one is built from: two types fall on the same pole exactly when they differ on an even number of the listed Jungian dichotomies. For the four Jungian dichotomies it is the dichotomy itself. `subjectivistObjectivist` also carries `alsoKnownAs: { name: 'Merry / Serious', poles: ['Merry', 'Serious'] }`.

#### `getAllDichotomies()` → object[]
Returns all 15, the four Jungian first.

#### `getTypesByPole(pole)` → object[]
Returns the 8 types on one pole, e.g. `getTypesByPole('Positivist')`.

| Id | Name | Kind | Product of |
|----|------|------|------------|
| `extraversionIntroversion` | Extraversion / Introversion | Jungian | Extraversion |
| `intuitionSensing` | Intuition / Sensing | Jungian | Intuition |
| `logicEthics` | Logic / Ethics | Jungian | Logic |
| `rationalityIrrationality` | Rationality / Irrationality | Jungian | Rationality |
| `staticDynamic` | Static / Dynamic | Reinin | Extraversion × Rationality |
| `processResult` | Process / Result | Reinin | Intuition × Logic × Rationality |
| `positivistNegativist` | Positivist / Negativist | Reinin | Extraversion × Intuition × Logic |
| `aristocraticDemocratic` | Aristocratic / Democratic | Reinin | Intuition × Logic |
| `constructivistEmotivist` | Constructivist / Emotivist | Reinin | Logic × Rationality |
| `judiciousDecisive` | Judicious / Decisive | Reinin | Extraversion × Intuition × Rationality |
| `carefreeFarsighted` | Carefree / Farsighted | Reinin | Extraversion × Intuition |
| `yieldingObstinate` | Yielding / Obstinate | Reinin | Extraversion × Logic |
| `askingDeclaring` | Asking / Declaring | Reinin | Extraversion × Intuition × Logic × Rationality |
| `tacticalStrategic` | Tactical / Strategic | Reinin | Intuition × Rationality |
| `subjectivistObjectivist` | Subjectivist / Objectivist | Reinin | Extraversion × Logic × Rationality |

---

### Raw data access

```js
const { data } = require('socionics-core');
data.types     // all 16 type objects keyed by code
data.relations // byType lookup + relation metadata
data.functions // all 8 function objects keyed by code
data.groups    // quadras, clubs, temperaments
data.dichotomies // all 15 dichotomies keyed by id
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
| Identity | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Dual | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Activation | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Mirror | Hetroverted | Arrhythmic | Repulsive | Symmetrical |
| Kindred | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Semi-dual | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Business | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Quasi-identity | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Benefactor | Monoverted | Arrhythmic | Attractive | **Asymmetrical** |
| Beneficiary | Monoverted | Arrhythmic | Attractive | **Asymmetrical** |
| Supervisor | Hetroverted | Arrhythmic | Repulsive | **Asymmetrical** |
| Supervisee | Hetroverted | Arrhythmic | Repulsive | **Asymmetrical** |
| Super-ego | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Extinguishment | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Mirage | Hetroverted | Rhythmic | Attractive | Symmetrical |
| Conflict | Hetroverted | Arrhythmic | Repulsive | Symmetrical |

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
