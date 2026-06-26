// One-time: verify all economy hour specs meet word minimum
const { hourTraining } = require('./_economy_st_hour_template');
const SPECS = require('./_economy_st_hour_specs');
for (const [id, spec] of Object.entries(SPECS)) {
  const a = hourTraining(spec);
  const w = a.split(/\s+/).filter(Boolean).length;
  console.log(id, w, w >= 1400 ? 'OK' : 'SHORT');
}
