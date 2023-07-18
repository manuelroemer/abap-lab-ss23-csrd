import {
  FormSchemaEntity,
  deleteFormSchemaEntity,
  createFormSchemaEntity,
  updateFormSchemaEntity,
} from '../api/FormSchemaEntity';
import { emptySchema } from '../formengine/SchemaUtils';
import { createState } from '../utils/State';
import { AsyncState, createAsync } from '../utils/StateAsync';

export interface FormSchemaManagementState {
  deleteFormSchemaMutation: AsyncState<string>;
  updateFormSchemaMutation: AsyncState<FormSchemaEntity>;
  createFormSchemaMutation: AsyncState<FormSchemaEntity | undefined, FormSchemaEntity>;
}

export function createFormSchemaManagementState() {
  return createState<FormSchemaManagementState>(({ state }) => ({
    parameters: {},
    query: {},

    deleteFormSchemaMutation: createAsync({
      state,
      key: 'deleteFormSchemaMutation',
      fetch: (id) => deleteFormSchemaEntity(id),
    }),

    updateFormSchemaMutation: createAsync({
      state,
      key: 'updateFormSchemaMutation',
      fetch: async (formSchema) => {
        updateFormSchemaEntity(formSchema.Id, {
          Name: formSchema.Name,
          Description: formSchema.Description,
          SchemaJson: JSON.stringify(formSchema.SchemaJson),
          MetadataJson: JSON.stringify(formSchema.MetadataJson),
          IsDraft: false,
        });
      },
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
