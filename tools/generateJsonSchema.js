const tsj = require('ts-json-schema-generator');
const fs = require('fs');
const path = require('path');

/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: path.join(__dirname, '../webapp/formengine/Schema.ts'),
  tsconfig: path.join(__dirname, '../tsconfig.json'),
  type: 'FormSchema',
};

const out = path.join(__dirname, '../webapp/formengine/Schema.JsonSchema.gen.ts');

const schema = tsj.createGenerator(config).createSchema(config.type);
const schemaString = JSON.stringify(schema, null, 2);
const file = `// Warning:
// This file is auto-generated. DO NOT make any manual changes to this file. They will be lost.
// For details about the generation, see the "tools/generateJsonSchema.js" file.

export const formSchemaJsonSchema = ${schemaString} as const;`;

fs.writeFileSync(out, file);
