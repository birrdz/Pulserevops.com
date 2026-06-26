// Economy hour sales trainings (st0073 format, ~1,500+ words). Blob-only updates.
const { hourTraining } = require('./_economy_st_hour_template');
const SPECS = require('./_economy_st_hour_specs');

const CONTENT = {};
for (const [id, spec] of Object.entries(SPECS)) {
  CONTENT[id] = {
    question: spec.question,
    tags: spec.tags,
    answer: hourTraining(spec),
  };
}
module.exports = CONTENT;
