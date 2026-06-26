// Export 200 Automotive Variations (Model, Type, Decade) → _ca_model_catalog_200.json
const fs = require('fs');
const {
  MODEL_CATALOG,
  MODEL_COUNT,
  BODY_TYPE_LABELS,
  hubModelItemListJsonLd,
} = require('./_ca_model_variations_200');

const byType = {};
for (const row of MODEL_CATALOG) {
  if (!byType[row.typeLabel]) byType[row.typeLabel] = [];
  byType[row.typeLabel].push({
    model: row.model,
    type: row.type,
    decades: row.decades,
  });
}

const out = {
  title: '200 Automotive Variations: Model, Type, and Decade',
  generated_at: new Date().toISOString(),
  total: MODEL_COUNT,
  body_types: Object.keys(BODY_TYPE_LABELS).length,
  type_labels: BODY_TYPE_LABELS,
  by_type: byType,
  flat: MODEL_CATALOG,
  schema_item_list_id: 'https://pulserevops.com/cars#model-catalog-200',
};

const path = 'C:/Users/koryj/website/_ca_model_catalog_200.json';
fs.writeFileSync(path, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ ok: true, path, total: MODEL_COUNT, types: Object.keys(byType).length }));
