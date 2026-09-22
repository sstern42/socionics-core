'use strict';

const typesData     = require('./data/types.json');
const relationsData = require('./data/relations.json');
const functionsData = require('./data/functions.json');
const groupsData    = require('./data/groups.json');
const dichotomiesData = require('./data/dichotomies.json');

// ─── Internal helpers ────────────────────────────────────────────────────────

function normalise(code) {
  return String(code).toUpperCase().trim();
}

function assertType(code) {
  const c = normalise(code);
  if (!typesData[c]) throw new Error(`Unknown socionics type: "${code}". Valid codes: ${Object.keys(typesData).join(', ')}`);
  return c;
}

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Returns the full type object for a given code.
 * @param {string} code - Socionics type code e.g. 'LII', 'ile'
 * @returns {object}
 */
function getType(code) {
  return typesData[assertType(code)];
}

/**
 * Returns all 16 type objects as an array.
 * @returns {object[]}
 */
function getAllTypes() {
  return Object.values(typesData);
}

/**
 * Looks up a type by its MBTI equivalent (e.g. 'INTj').
 * Case-insensitive on the letter part; the j/p suffix is case-sensitive.
 * @param {string} mbti
 * @returns {object|null}
 */
function getTypeByMbti(mbti) {
  const target = mbti.trim();
  return Object.values(typesData).find(t => t.mbti.toLowerCase() === target.toLowerCase()) || null;
}

// ─── Functions ───────────────────────────────────────────────────────────────

/**
 * Returns the function object for a given code.
 * @param {string} code - e.g. 'Ne', 'Ti'
 * @returns {object}
 */
function getFunction(code) {
  const fn = functionsData[code];
  if (!fn) throw new Error(`Unknown function code: "${code}". Valid codes: ${Object.keys(functionsData).join(', ')}`);
  return fn;
}

/**
 * Returns all 8 function objects as an array.
 * @returns {object[]}
 */
function getAllFunctions() {
  return Object.values(functionsData);
}

// ─── Relations ───────────────────────────────────────────────────────────────

// Map directional keys to canonical relation names
const DIRECTIONAL_MAP = {
  benefactor:    'benefaction',
  beneficiary:   'benefaction',
  supervisor:    'supervision',
  supervisee:    'supervision'
};

/**
 * Returns the intertype relation between two types.
 *
 * @param {string} typeA
 * @param {string} typeB
 * @returns {object} - includes relation name, metadata, and (for asymmetric relations) direction
 *
 * @example
 * getRelation('LII', 'ESE')
 * // { relation: 'dual', name: 'Dual', from: 'LII', to: 'ESE', orientation: 'Hetroverted', ... }
 *
 * @example
 * getRelation('ILE', 'EIE')
 * // { relation: 'benefaction', name: 'Benefaction', from: 'ILE', to: 'EIE',
 * //   direction: { benefactor: 'ILE', beneficiary: 'EIE' }, ... }
 */
function getRelation(typeA, typeB) {
  const a = assertType(typeA);
  const b = assertType(typeB);

  const rels = relationsData.byType[a];
  const foundKey = Object.keys(rels).find(k => rels[k] === b);

  if (!foundKey) throw new Error(`No relation found between ${a} and ${b}.`);

  const canonicalKey = DIRECTIONAL_MAP[foundKey] || foundKey;
  const meta = relationsData.metadata[canonicalKey];

  const result = {
    relation: canonicalKey,
    from: a,
    to: b,
    ...meta
  };

  // Attach directional info for asymmetric relations
  if (foundKey === 'benefactor') {
    result.direction = { benefactor: b, beneficiary: a };
  } else if (foundKey === 'beneficiary') {
    result.direction = { benefactor: a, beneficiary: b };
  } else if (foundKey === 'supervisor') {
    result.direction = { supervisor: b, supervisee: a };
  } else if (foundKey === 'supervisee') {
    result.direction = { supervisor: a, supervisee: b };
  }

  return result;
}

/**
 * Returns all intertype relations for a given type as an array.
 * @param {string} code
 * @returns {object[]}
 */
function getRelationsFor(code) {
  const a = assertType(code);
  const rels = relationsData.byType[a];
  return Object.entries(rels).map(([key, partnerCode]) => {
    return getRelation(a, partnerCode);
  });
}

/**
 * Returns all types that share a given relation with the specified type.
 * @param {string} code
 * @param {string} relationName - e.g. 'dual', 'conflict', 'benefaction'
 * @returns {object[]} - array of type objects
 */
function getTypesByRelation(code, relationName) {
  const a = assertType(code);
  const rels = relationsData.byType[a];
  const rel = relationName.toLowerCase();

  return Object.entries(rels)
    .filter(([key]) => {
      const canonical = DIRECTIONAL_MAP[key] || key;
      return canonical === rel || key === rel;
    })
    .map(([, partnerCode]) => typesData[partnerCode]);
}

// ─── Groups ──────────────────────────────────────────────────────────────────

/**
 * Returns the quadra object for a type or quadra name.
 * @param {string} codeOrName - type code (e.g. 'LII') or quadra name (e.g. 'Alpha')
 * @returns {object}
 */
function getQuadra(codeOrName) {
  const direct = groupsData.quadras[codeOrName];
  if (direct) return direct;

  // Try as type code
  try {
    const type = getType(codeOrName);
    return groupsData.quadras[type.quadra];
  } catch (_) {
    throw new Error(`Unknown quadra or type: "${codeOrName}"`);
  }
}

/**
 * Returns the club object for a type or club name.
 * @param {string} codeOrName - type code or club name (e.g. 'Researcher')
 * @returns {object}
 */
function getClub(codeOrName) {
  const direct = groupsData.clubs[codeOrName];
  if (direct) return direct;

  try {
    const type = getType(codeOrName);
    return groupsData.clubs[type.club];
  } catch (_) {
    throw new Error(`Unknown club or type: "${codeOrName}"`);
  }
}

/**
 * Returns the temperament object for a type or temperament code.
 * @param {string} codeOrName - type code or temperament (e.g. 'EP', 'IJ')
 * @returns {object}
 */
function getTemperament(codeOrName) {
  const direct = groupsData.temperaments[codeOrName];
  if (direct) return direct;

  try {
    const type = getType(codeOrName);
    return groupsData.temperaments[type.temperament];
  } catch (_) {
    throw new Error(`Unknown temperament or type: "${codeOrName}"`);
  }
}

/**
 * Returns the raw groups data object containing all quadras, clubs and temperaments.
 * @returns {object}
 */
function getAllGroups() {
  return groupsData;
}

// ─── Dichotomies ─────────────────────────────────────────────────────────────

/**
 * Returns a dichotomy by id (e.g. 'staticDynamic') or by either pole name
 * (e.g. 'Static', 'dynamic'). Case-insensitive.
 * @param {string} idOrPole
 * @returns {object}
 */
function getDichotomy(idOrPole) {
  const target = String(idOrPole).trim().toLowerCase();
  const found = Object.values(dichotomiesData).find(d =>
    d.id.toLowerCase() === target || d.poles.some(p => p.toLowerCase() === target)
  );
  if (!found) throw new Error(`Unknown dichotomy or pole: "${idOrPole}". Valid ids: ${Object.keys(dichotomiesData).join(', ')}`);
  return found;
}

/**
 * Returns all 15 dichotomies (4 Jungian, then 11 Reinin) as an array.
 * @returns {object[]}
 */
function getAllDichotomies() {
  return Object.values(dichotomiesData);
}

/**
 * Returns the 8 types on a given pole of a dichotomy.
 * @param {string} pole - e.g. 'Static', 'Positivist', 'Rational'
 * @returns {object[]} - array of type objects
 */
function getTypesByPole(pole) {
  const d = getDichotomy(pole);
  const p = d.poles.find(x => x.toLowerCase() === String(pole).trim().toLowerCase());
  if (!p) throw new Error(`"${pole}" is a dichotomy id, not a pole. Poles of ${d.id}: ${d.poles.join(', ')}`);
  return Object.values(typesData).filter(t => t.dichotomies[d.id] === p);
}

// ─── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  // Types
  getType,
  getAllTypes,
  getTypeByMbti,
  // Functions
  getFunction,
  getAllFunctions,
  // Relations
  getRelation,
  getRelationsFor,
  getTypesByRelation,
  // Groups
  getQuadra,
  getClub,
  getTemperament,
  getAllGroups,
  // Dichotomies
  getDichotomy,
  getAllDichotomies,
  getTypesByPole,
  // Raw data (for advanced use)
  data: {
    types:     typesData,
    relations: relationsData,
    functions: functionsData,
    groups:    groupsData,
    dichotomies: dichotomiesData
  }
};
