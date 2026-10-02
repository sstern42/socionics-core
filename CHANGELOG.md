# Changelog

## 1.4.0

- Added two longer descriptions to all eight functions, copied verbatim from the function pages on socionicsinsight.com: `descriptionLong` (the opening "the function of…" description) and `descriptionBehaviour` (the "Together, … is the capacity to…" summary, with its Markdown emphasis). The existing `description` field is unchanged.

## 1.3.0

- Added club work profiles and definitions for five work-related small groups (stress resistance, implementation, planning style, leadership style, goal-setting), sourced from Kovalenko and Zvonaryova (2020). New type fields: stressGroup, implementationGroup, planningStyle.

## 1.2.0

- Added stability_conditions (natural task and comfortable distance) to all relations, sourced from Kovalenko and Zvonaryova (2020). Stored as `stabilityConditions` on each entry in `data/relations.json` `metadata`, with the citation in a new top-level `sources` map.
