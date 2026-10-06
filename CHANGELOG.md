# Changelog

## 1.5.0

- Added three more small groups from Kovalenko and Zvonaryova (2020), chapter 11, as top-level objects in `data/groups.json`, each with a `groupNote` and four definitions (`name`, `formula`, `types`, `description`, `source`):
  - `quasiQuadras` (11.2): Phi, Omega, Chi and Psi, each with an `altName` (quasi-Delta, quasi-Alpha, quasi-Gamma, quasi-Beta). Formula: Carefree or Farsighted, Yielding or Obstinate, Aristocratic or Democratic.
  - `perception` (11.10): Thorough, Circumstantial, Flexible and Receptive. Formula: Rational or Irrational, Intuitive or Sensing, Tactical or Strategic.
  - `thinkingForms` (11.9): Dialectical-algorithmic, Holographic, Causal-deterministic and Vortex, Gulenko's cognitive styles. Formula: Static or Dynamic, Process or Result, Positivist or Negativist.
- New type fields: `quasiQuadra`, `perceptionGroup`, `thinkingForm`. Membership is each formula applied to the type's dichotomies, and the tests check the two agree.
- Added `psychoanalyticNote`: the book's psychoanalytic groups (11.5) are the existing romance styles, with the same formula and membership, so no new field is added. The tests check that the formula reproduces `romanceStyle` for every type.
- Descriptions are English summaries of the book's text.

## 1.4.0

- Added two longer descriptions to all eight functions, copied verbatim from the function pages on socionicsinsight.com: `descriptionLong` (the opening "the function of…" description) and `descriptionBehaviour` (the "Together, … is the capacity to…" summary, with its Markdown emphasis). The existing `description` field is unchanged.

## 1.3.0

- Added club work profiles and definitions for five work-related small groups (stress resistance, implementation, planning style, leadership style, goal-setting), sourced from Kovalenko and Zvonaryova (2020). New type fields: stressGroup, implementationGroup, planningStyle.

## 1.2.0

- Added stability_conditions (natural task and comfortable distance) to all relations, sourced from Kovalenko and Zvonaryova (2020). Stored as `stabilityConditions` on each entry in `data/relations.json` `metadata`, with the citation in a new top-level `sources` map.
