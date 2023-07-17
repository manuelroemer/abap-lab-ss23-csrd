import { FormSchemaEntity, deleteFormSchemaEntity, createFormSchemaEntity } from '../api/FormSchemaEntity';
import { emptySchema } from '../formengine/SchemaUtils';
import { createState } from '../utils/State';
import { AsyncState, createAsync } from '../utils/StateAsync';

export interface FormSchemaManagementState {
  deleteFormSchemaMutation: AsyncState<string>;
  createFormSchemaMutation: AsyncState<FormSchemaEntity | undefined, FormSchemaEntity>;
}

export function createFormSchemaManagementState() {
  return createState<FormSchemaManagementState>(({ state }) => ({
    parameters: {},
    query: {},

    deleteFormSchemaMutation: createAsync({
      state,
      key: 'deleteFormSchemaMutation',
      fetch: async (id) => deleteFormSchemaEntity(id),
    }),

    createFormSchemaMutation: createAsync({
      state,
      key: 'createFormSchemaMutation',
      fetch: (formSchemaTemplate) =>
        createFormSchemaEntity({
          Type: formSchemaTemplate?.Type ?? 'csrd',
          SchemaJson: formSchemaTemplate?.SchemaJson ?? JSON.stringify(emptySchema),
          MetadataJson: formSchemaTemplate?.MetadataJson ?? '{}',
          IsDraft: true,
          Name: formSchemaTemplate?.Name ?? '',
          Description: formSchemaTemplate?.Description ?? '',
        }),
    }),
  }));
}
