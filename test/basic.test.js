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
assert('every function has descriptionLong',
  getAllFunctions().every(f => typeof f.descriptionLong === 'string' && /^the function of /i.test(f.descriptionLong)));
assert('every function has descriptionBehaviour',
  getAllFunctions().every(f => typeof f.descriptionBehaviour === 'string' && f.descriptionBehaviour.startsWith(`Together, ${f.code} is the capacity to`)));
assert('existing description unchanged',  ne.description === 'Noticing trends and possibilities in a reality filled with unknown opportunities');

// ─── Relations ───────────────────────────────────────────────────────────────
section('getRelation() — symmetric');
const dual = getRelation('LII', 'ESE');
assert('LII-ESE is dual',              dual.relation === 'dual');
assert('dual is heteroverted',          dual.orientation === 'Heteroverted');
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

section('stabilityConditions');
const { data } = require('../index.js');
const DISTANCE_LABELS = { 1: 'closest', 2: 'close', 3: 'medium', 4: 'more than medium', 5: 'far', 6: 'farthest' };
const ROLES = { benefaction: ['benefactor', 'beneficiary'], supervision: ['supervisor', 'supervisee'] };
const validDistance = d => d && Number.isInteger(d.rank) && DISTANCE_LABELS[d.rank] === d.label &&
                           Object.keys(d).length === 2;
const relMeta = Object.entries(data.relations.metadata);
assert('14 relations in metadata',     relMeta.length === 14);
assert('every relation has one',       relMeta.every(([, m]) => m.stabilityConditions));
assert('every source key resolves',    relMeta.every(([, m]) =>
  data.relations.sources[m.stabilityConditions.source]));
assert('symmetric: string task, valid distance', relMeta.filter(([k]) => !ROLES[k]).every(([, m]) =>
  typeof m.stabilityConditions.task === 'string' && validDistance(m.stabilityConditions.distance)));
assert('asymmetric: both roles, valid distances', Object.entries(ROLES).every(([k, roles]) => {
  const sc = data.relations.metadata[k].stabilityConditions;
  return roles.every(r => typeof sc.task[r] === 'string' && validDistance(sc.distance[r])) &&
         Object.keys(sc.task).length === 2 && Object.keys(sc.distance).length === 2;
}));
assert('role keys match byType keys',  Object.values(ROLES).flat().every(r => r in data.relations.byType.ILE));
assert('notes are strings if present', relMeta.every(([, m]) =>
  !('note' in m.stabilityConditions) || typeof m.stabilityConditions.note === 'string'));
assert('dual is closest',              dual.stabilityConditions.distance.rank === 1);
assert('supervisee is farthest',       sup1.stabilityConditions.distance.supervisee.label === 'farthest');

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

section('club work profiles');
const groupSource = key => data.groups.sources && data.groups.sources[key];
const isStrArr = a => Array.isArray(a) && a.length > 0 && a.every(s => typeof s === 'string');
const clubs = Object.values(data.groups.clubs);
const hasPoles = (t, formula) => formula.every(p => Object.values(t.dichotomies).includes(p));
assert('groups source is chapter 11',  groupSource('kovalenko-zvonaryova-2020').chapter === 11);
assert('clubsNote is a string',        typeof data.groups.clubsNote === 'string');
assert('every club has a workProfile', clubs.every(c => c.workProfile &&
  ['formula', 'detailed', 'surface', 'fields'].every(k => isStrArr(c.workProfile[k])) &&
  typeof c.workProfile.summary === 'string' && groupSource(c.workProfile.source)));
assert('club formula matches types',   clubs.every(c => c.types.slice().sort().join() ===
  all.filter(t => hasPoles(t, c.workProfile.formula)).map(t => t.code).sort().join()));

// Work groups: each partitions the 16 types into 4 groups of 4, and the stored
// membership (group `types` and the per-type field) is its formula applied to
// the type's dichotomies. leadershipStyle is stored on types as `argumentation`.
section('work groups');
const WORK_GROUPS = {
  stressResistance: 'stressGroup',
  implementation:   'implementationGroup',
  planningStyle:    'planningStyle',
  leadershipStyle:  'argumentation'
};
Object.entries(WORK_GROUPS).forEach(([key, field]) => {
  const grp = data.groups[key];
  const entries = Object.entries(grp).filter(([k]) => k !== 'groupNote');
  const byFormula = e => all.filter(t => hasPoles(t, e.formula)).map(t => t.code);
  assert(`${key}: groupNote and 4 groups`, typeof grp.groupNote === 'string' && entries.length === 4 &&
    entries.every(([k, e]) => e.name === k && typeof e.description === 'string' && groupSource(e.source)));
  assert(`${key}: 4 types per group`,      entries.every(([, e]) => byFormula(e).length === 4 && e.types.length === 4));
  assert(`${key}: each type in one group`, all.every(t => entries.filter(([, e]) => hasPoles(t, e.formula)).length === 1));
  assert(`${key}: types match formula`,    entries.every(([, e]) =>
    e.types.slice().sort().join() === byFormula(e).sort().join()));
  assert(`${key}: type.${field} matches`,  all.every(t => {
    const match = entries.find(([, e]) => hasPoles(t, e.formula));
    return match && t[field] === match[0];
  }));
});

// goalSetting lives on the temperaments; membership is the temperament's types.
const temps = Object.entries(data.groups.temperaments);
assert('goalSettingNote is a string',  typeof data.groups.goalSettingNote === 'string');
assert('goalSetting: 4 distinct names', new Set(temps.map(([, t]) => t.goalSetting.name)).size === 4 &&
  temps.every(([, t]) => typeof t.goalSetting.description === 'string' && groupSource(t.goalSetting.source)));
assert('goalSetting: each type in one', all.every(t =>
  temps.filter(([, tm]) => hasPoles(t, tm.goalSetting.formula)).length === 1));
assert('goalSetting: matches temperaments', temps.every(([k, tm]) =>
  tm.types.slice().sort().join() === all.filter(t => hasPoles(t, tm.goalSetting.formula)).map(t => t.code).sort().join() &&
  tm.types.every(c => getType(c).temperament === k)));

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
