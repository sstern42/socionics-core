# socionics-core

Canonical socionics data and query library. Covers all 16 types, 16 intertype relations, 8 functions, 15 dichotomies, quadras, clubs, temperaments, five work-related small groups and three further small groups (quasi-quadras, perception groups and thinking forms), structured for use in any JavaScript project.

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
console.log(rel.orientation); // 'Heteroverted'
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

// Get quadra, club, temperament: by type code or group name
socionics.getQuadra('LII');       // Alpha quadra object
socionics.getClub('Researcher');  // Researcher club object
socionics.getTemperament('IJ');   // IJ temperament object
```

---

## API at a glance

| Area | Functions |
|------|-----------|
| Types | `getType`, `getAllTypes`, `getTypeByMbti` |
| Functions | `getFunction`, `getAllFunctions` |
| Relations | `getRelation`, `getRelationsFor`, `getTypesByRelation` |
| Groups | `getQuadra`, `getClub`, `getTemperament`, `getAllGroups` |
| Dichotomies | `getDichotomy`, `getAllDichotomies`, `getTypesByPole` |
| Raw data | `data` (`types`, `relations`, `functions`, `groups`, `dichotomies`) |

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
  stressGroup: 'Trainable',
  implementationGroup: 'Resultator',
  planningStyle: 'Stable',
  quasiQuadra: 'Psi',
  perceptionGroup: 'Circumstantial',
  thinkingForm: 'Holographic',
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
    { position: 8, block: 'Id',        role: 'Demonstrative', code: 'Ni' }
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
  description: 'Noticing trends and possibilities in a reality filled with unknown opportunities',
  descriptionLong: 'The function of possibility — building associative maps of what could exist rather than what does.',
  descriptionBehaviour: 'Together, Ne is the capacity to read the external world for what it *could become* rather than what it currently is.'
}
```

The `slide` field is the SLIDE attitude name, a secondary descriptive label for each function used in socionics theory.

`descriptionLong` and `descriptionBehaviour` are copied verbatim from the function pages on [socionicsinsight.com](https://www.socionicsinsight.com/functions/): `descriptionLong` is the page's opening "the function of…" description and `descriptionBehaviour` is the "Together, … is the capacity to…" summary, which keeps the page's Markdown emphasis.

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
  orientation: 'Heteroverted',  // or 'Monoverted'
  rhythm: 'Rhythmic',          // or 'Arrhythmic'
  vibe: 'Attractive',          // or 'Repulsive'
  symmetry: 'Symmetrical',     // or 'Asymmetrical'
  description: '...',
  stabilityConditions: { ... } // see Stability conditions below
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

#### Stability conditions

Every relation also carries a `stabilityConditions` object: the task the relation naturally serves, and the psychological distance at which it is most comfortable.

```js
// getRelation('LII', 'ESE').stabilityConditions
{
  task: 'Recovery: restoring energy and lowering anxiety',
  distance: { rank: 1, label: 'closest' },
  source: 'kovalenko-zvonaryova-2020'
}
```

- `task`: a short string.
- `distance`: `rank` is an integer from 1 to 6, and `label` is fixed by the rank: 1 `closest`, 2 `close`, 3 `medium`, 4 `more than medium`, 5 `far`, 6 `farthest`.
- `note`: present only on some relations (Activation, Identity), where the source qualifies the distance.
- `source`: a key into the top-level `sources` map in `data/relations.json`, which holds the full citation.

For benefaction and supervision, `task` and `distance` are keyed by role, using the same role keys as `byType` (`benefactor` / `beneficiary`, `supervisor` / `supervisee`):

```js
// data.relations.metadata.supervision.stabilityConditions
{
  task: {
    supervisor: 'Gaining control over their own abilities',
    supervisee: 'Building personal boundaries'
  },
  distance: {
    supervisor: { rank: 3, label: 'medium' },
    supervisee: { rank: 6, label: 'farthest' }
  },
  source: 'kovalenko-zvonaryova-2020'
}
```

Unlike the relation pairs and the orientation, rhythm, vibe and symmetry properties, which follow from the structure of Model A, `stabilityConditions` is one school's interpretation. It comes from chapter 12 of R.K. Kovalenko and N.A. Zvonaryova, *Sotsionika: polnyy kurs lektsiy* (*Socionics: A Complete Lecture Course*), Novosibirsk, 2020, and is attributed through its `source` key. Other authors rank and describe these relations differently.

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

Each club carries a `workProfile`: what the club handles in detail, what it handles only on the surface, and the fields it suits.

```js
// getClub('Pragmatist').workProfile
{
  formula: ['Logical', 'Sensing', 'Aristocratic'],
  detailed: ['Logical systems within production', 'Hierarchical management', ...],
  surface: ['Relationships', 'Emotional atmosphere', ...],
  fields: ['Setting up processes', 'Production', ...],
  summary: 'Understand equipment in detail and set up production with every practical detail accounted for.',
  bookName: 'Managers',   // only where the source names the club differently
  source: 'kovalenko-zvonaryova-2020'
}
```

`data.groups.clubsNote` holds the source's caveat that clubs describe abilities, not interests or chosen field.

#### `getTemperament(codeOrName)` → object
Accepts a type code or temperament code (`'EP'`, `'EJ'`, `'IP'`, `'IJ'`).

Each temperament carries a `goalSetting` object with the source's name and description for it as a goal-setting group (`EJ` Linear-assertive, `IJ` Balanced-stable, `EP` Flexible-manoeuvring, `IP` Receptive-adaptive). Membership is the temperament's own `types`. `data.groups.goalSettingNote` describes the grouping.

```js
// getTemperament('EJ').goalSetting
{
  name: 'Linear-assertive',
  formula: ['Rational', 'Extraverted', 'Dynamic'],
  description: 'One goal, aimed at the outside world. ...',
  source: 'kovalenko-zvonaryova-2020'
}
```

#### `getAllGroups()` → object
Returns the raw groups data: quadras, clubs and temperaments, the four work-group definitions and three further groups below, the notes, and the `sources` map.

#### Work groups

Four further small groups describe how a type works. Each is a top-level object in `data/groups.json` holding a `groupNote` string and four definitions keyed by name. The type field that stores membership is listed alongside.

| Key in `data.groups` | Groups | Type field |
|----------------------|--------|------------|
| `stressResistance` | Fragile, Viscous, Trainable, Flexible | `stressGroup` |
| `implementation` | Perfectionist, Finisher, Implementer, Resultator | `implementationGroup` |
| `planningStyle` | Stable, Staged, Variant, Free | `planningStyle` |
| `leadershipStyle` | Constructor, Guardian, Restructurer, Diplomat | `argumentation` |

The fifth, goal-setting, is stored on the temperaments (see `getTemperament` above).

```js
// data.groups.planningStyle.Stable
{
  name: 'Stable',
  formula: ['Rational', 'Farsighted', 'Judicious'],
  types: ['LII', 'ESE', 'EII', 'LSE'],
  description: 'Set goals in sequence and plan ahead, anticipating how things will unfold. ...',
  source: 'kovalenko-zvonaryova-2020'
}
```

- `formula`: the dichotomy poles that define the group. A type belongs to the group exactly when its `dichotomies` include all three. Each formula splits the 16 types into four groups of four, and the tests check that `types` and the type field agree with it.
- `altName`: `leadershipStyle` only. Sergei Savchenko's Tarot suit names (Pentacles, Staves, Swords, Cups), a memory aid rather than part of the theory.
- When iterating a group's definitions, skip the `groupNote` key.

#### Further small groups

Three more groups from the same chapter use the same shape: a `groupNote` and four definitions keyed by name, each with `formula`, `types`, `description` and `source`.

| Key in `data.groups` | Groups | Type field |
|----------------------|--------|------------|
| `quasiQuadras` | Phi, Omega, Chi, Psi | `quasiQuadra` |
| `perception` | Thorough, Circumstantial, Flexible, Receptive | `perceptionGroup` |
| `thinkingForms` | Dialectical-algorithmic, Holographic, Causal-deterministic, Vortex | `thinkingForm` |

- `altName`: on `quasiQuadras`, the quadra each group is a quasi-version of (quasi-Delta for Phi, quasi-Alpha for Omega, quasi-Gamma for Chi, quasi-Beta for Psi).
- `thinkingForms` are the four groups Gulenko calls cognitive styles.
- The book's psychoanalytic groups are the romance styles under another name, with the same formula and the same types, so they have no field of their own. `data.groups.psychoanalyticNote` records this, and `romanceStyle` holds the membership.

Unlike quadras, clubs, temperaments and the dichotomies, which follow from the structure of Model A, the club `workProfile`, the `goalSetting` descriptions, the four work groups and the three further groups above are one school's interpretation. They come from chapter 11 of R.K. Kovalenko and N.A. Zvonaryova, *Sotsionika: polnyy kurs lektsiy* (*Socionics: A Complete Lecture Course*), Novosibirsk, 2020, and are attributed through their `source` key, which points into the top-level `sources` map in `data/groups.json`. The authors base the stress-resistance, implementation and thinking-form descriptions on their own resonance-group experiments.

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
data.relations // byType lookup, relation metadata, and sources cited by stabilityConditions
data.functions // all 8 function objects keyed by code
data.groups    // quadras, clubs, temperaments, work groups, and sources cited by them
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
| Dual | Heteroverted | Rhythmic | Attractive | Symmetrical |
| Activation | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Mirror | Heteroverted | Arrhythmic | Repulsive | Symmetrical |
| Kindred | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Semi-dual | Heteroverted | Rhythmic | Attractive | Symmetrical |
| Business | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Quasi-identity | Monoverted | Arrhythmic | Attractive | Symmetrical |
| Benefactor | Monoverted | Arrhythmic | Attractive | **Asymmetrical** |
| Beneficiary | Monoverted | Arrhythmic | Attractive | **Asymmetrical** |
| Supervisor | Heteroverted | Arrhythmic | Repulsive | **Asymmetrical** |
| Supervisee | Heteroverted | Arrhythmic | Repulsive | **Asymmetrical** |
| Super-ego | Monoverted | Rhythmic | Repulsive | Symmetrical |
| Extinguishment | Heteroverted | Rhythmic | Attractive | Symmetrical |
| Mirage | Heteroverted | Rhythmic | Attractive | Symmetrical |
| Conflict | Heteroverted | Arrhythmic | Repulsive | Symmetrical |

---

## Background

Socionics is a theory of personality and interpersonal relations developed by Aušra Augustinavičiūtė in the 1970s, building on Carl Jung's work on psychological types. It shares the familiar 16-type structure with MBTI but takes a different road: the function ordering differs, and the intertype relations system has no MBTI equivalent.

For human-readable explanations of every type, function and relation, see **[socionicsinsight.com](https://www.socionicsinsight.com)**. The package's page on the site is [socionicsinsight.com/open-source/](https://www.socionicsinsight.com/open-source/).

For a plain-English introduction to socionics, see the *Socionics Made Simple* Kindle series [on Amazon](https://amzn.to/4rDcbmW).

---

## Contributing

Corrections, additional attributes, and translations are welcome. Please open an issue before submitting a PR for anything beyond a data fix.

## Licence

MIT
