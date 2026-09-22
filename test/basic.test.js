// basic.test.js — smoke tests, no test framework required
// Run with: node test/basic.test.js

'use strict';

const {
  getType, getAllTypes, getTypeByMbti,
  getFunction, getAllFunctions,
  getRelation, getRelationsFor, getTypesByRelation,
  getQuadra, getClub, getTemperament,
  getDichotomy, getAllDichotomies, getTypesByPole
} = require('../index.js');

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓  ${label}`);
    passed++;
  } else {
    console.error(`  ✗  ${label}`);
    failed++;
  }
}

function section(name) {
  console.log(`\n${name}`);
}

// ─── Types ───────────────────────────────────────────────────────────────────
section('getType()');
const lii = getType('LII');
assert('returns type object',          lii && typeof lii === 'object');
assert('correct name',                 lii.name === 'The Analyst');
assert('correct mbti',                 lii.mbti === 'INTj');
assert('correct quadra',               lii.quadra === 'Alpha');
assert('has 8 functions',              lii.functions.length === 8);
assert('leading function is Ti',       lii.functions[0].code === 'Ti');
assert('suggestive function is Fe',    lii.functions[4].code === 'Fe');
assert('case-insensitive lookup',      getType('ile').code === 'ILE');

section('getAllTypes()');
const all = getAllTypes();
assert('returns 16 types',             all.length === 16);

section('getTypeByMbti()');
assert('finds LII by INTj',            getTypeByMbti('INTj').code === 'LII');
assert('finds ESE by ESFj',            getTypeByMbti('ESFj').code === 'ESE');
assert('returns null for unknown',     getTypeByMbti('XXXX') === null);

// ─── Functions ───────────────────────────────────────────────────────────────
section('getFunction()');
const ne = getFunction('Ne');
assert('returns function object',      ne && typeof ne === 'object');
assert('correct SLIDE name',           ne.slide === 'Creative Thinking');
assert('correct attitude',             ne.attitude === 'Extraverted');

section('getAllFunctions()');
assert('returns 8 functions',          getAllFunctions().length === 8);

// ─── Relations ───────────────────────────────────────────────────────────────
section('getRelation() — symmetric');
const dual = getRelation('LII', 'ESE');
assert('LII-ESE is dual',              dual.relation === 'dual');
assert('dual is hetroverted',          dual.orientation === 'Hetroverted');
assert('dual is rhythmic',             dual.rhythm === 'Rhythmic');
assert('dual is attractive',           dual.vibe === 'Attractive');
assert('dual is symmetrical',          dual.symmetry === 'Symmetrical');

const conflict = getRelation('LII', 'SEE');
assert('LII-SEE is conflict',          conflict.relation === 'conflict');
assert('conflict is arrhythmic',       conflict.rhythm === 'Arrhythmic');
assert('conflict is repulsive',        conflict.vibe === 'Repulsive');

section('getRelation() — asymmetric');
const ben1 = getRelation('ILE', 'EIE');
assert('ILE→EIE is benefaction',       ben1.relation === 'benefaction');
assert('ILE is benefactor',            ben1.direction.benefactor === 'ILE');
assert('EIE is beneficiary',           ben1.direction.beneficiary === 'EIE');

const ben2 = getRelation('EIE', 'ILE');
assert('EIE→ILE is also benefaction',  ben2.relation === 'benefaction');
assert('direction flips correctly',    ben2.direction.benefactor === 'ILE');

const sup1 = getRelation('ILE', 'LSI');
assert('ILE supervises LSI',           sup1.relation === 'supervision');
assert('ILE is supervisor',            sup1.direction.supervisor === 'ILE');

section('getRelationsFor()');
const liiRels = getRelationsFor('LII');
assert('returns 16 relation entries',  liiRels.length === 16);

section('getTypesByRelation()');
const liiDuals = getTypesByRelation('LII', 'dual');
assert('LII dual is ESE',              liiDuals.length === 1 && liiDuals[0].code === 'ESE');

// ─── Groups ──────────────────────────────────────────────────────────────────
section('getQuadra()');
const alpha = getQuadra('Alpha');
assert('Alpha has 4 types',            alpha.types.length === 4);
assert('Alpha contains LII',           alpha.types.includes('LII'));

const alphaFromType = getQuadra('LII');
assert('lookup by type code works',    alphaFromType.name === 'Alpha');

section('getClub()');
const researcher = getClub('Researcher');
assert('Researcher has 4 types',       researcher.types.length === 4);

const resFromType = getClub('ILE');
assert('lookup by type code works',    resFromType.name === 'Researcher');

section('getTemperament()');
const ij = getTemperament('IJ');
assert('IJ has 4 types',               ij.types.length === 4);
assert('IJ contains LII',              ij.types.includes('LII'));

const ijFromType = getTemperament('LII');
assert('lookup by type code works',    ijFromType.name === 'IJ');

// ─── Dichotomies ─────────────────────────────────────────────────────────────
section('getAllDichotomies()');
const dichs = getAllDichotomies();
assert('returns 15 dichotomies',       dichs.length === 15);
assert('4 Jungian, 11 Reinin',         dichs.filter(d => d.kind === 'jungian').length === 4 &&
                                       dichs.filter(d => d.kind === 'reinin').length === 11);
assert('every type has all 15 values', all.every(t =>
  dichs.every(d => d.poles.includes(t.dichotomies[d.id])) &&
  Object.keys(t.dichotomies).length === 15));
assert('every pole holds 8 types',     dichs.every(d => d.poles.every(p => getTypesByPole(p).length === 8)));
assert('no two types share a profile', new Set(all.map(t => JSON.stringify(t.dichotomies))).size === 16);

// Jungian values agree with the older top-level fields.
assert('E/I agrees with extraversion', all.every(t =>
  (t.dichotomies.extraversionIntroversion === 'Extraverted') === t.extraversion));
assert('rationality agrees',           all.every(t =>
  t.dichotomies.rationalityIrrationality === t.rationality));
assert('N/S and T/F agree with club',  all.every(t => {
  const short = getClub(t.code).shortName;
  return (t.dichotomies.intuitionSensing === 'Intuitive') === (short[0] === 'N') &&
         (t.dichotomies.logicEthics === 'Logical') === (short[1] === 'T');
}));

// Each dichotomy is the parity of the Jungian dichotomies named in `product`,
// and the 15 products are the 15 non-empty subsets of the four, once each.
const jungIds = dichs.filter(d => d.kind === 'jungian').map(d => d.id);
const bit = (t, id) => t.dichotomies[id] === getDichotomy(id).poles[0];
assert('products are 15 distinct subsets', new Set(dichs.map(d =>
  d.product.slice().sort().join('+'))).size === 15 &&
  dichs.every(d => d.product.every(id => jungIds.includes(id))));
assert('each dichotomy is its product', dichs.every(d => {
  const parity = t => d.product.reduce((acc, id) => acc !== bit(t, id), false);
  const same = all.map(t => parity(t) === bit(t, d.id));
  return same.every(Boolean) || same.every(x => !x);
}));

// The three Reinin dichotomies that follow quadra lines.
const quadrasOf = pole => [...new Set(getTypesByPole(pole).map(t => t.quadra))].sort().join('+');
assert('Subjectivist is Alpha+Beta',   quadrasOf('Subjectivist') === 'Alpha+Beta');
assert('Judicious is Alpha+Delta',     quadrasOf('Judicious') === 'Alpha+Delta');
assert('Democratic is Alpha+Gamma',    quadrasOf('Democratic') === 'Alpha+Gamma');

section('getDichotomy()');
assert('lookup by id',                 getDichotomy('staticDynamic').name === 'Static / Dynamic');
assert('lookup by pole, any case',     getDichotomy('dynamic').id === 'staticDynamic');
assert('LII is Static',                lii.dichotomies.staticDynamic === 'Static');
assert('Merry/Serious alias recorded', getDichotomy('Subjectivist').alsoKnownAs.name === 'Merry / Serious');
let threw = false;
try { getDichotomy('Cheerful'); } catch (_) { threw = true; }
assert('throws on unknown name',       threw);

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
