// basic.test.js — smoke tests, no test framework required
// Run with: node test/basic.test.js

'use strict';

const {
  getType, getAllTypes, getTypeByMbti,
  getFunction, getAllFunctions,
  getRelation, getRelationsFor, getTypesByRelation,
  getQuadra, getClub, getTemperament
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

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
