import { createState } from '../utils/State';
import {
  FormBuilderStateElementPropertiesAreaSlice,
  createFormBuilderElementPropertiesAreaSlice,
} from './FormBuilderElementPropertiesArea';
import {
  FormBuilderStatePagePropertiesAreaSlice,
  createFormBuilderPagePropertiesAreaSlice,
} from './FormBuilderPagePropertiesArea';
import { FormBuilderStatePreviewAreaSlice, createFormBuilderPreviewAreaSlice } from './FormBuilderPreviewArea';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './FormBuilderFormEngine';
import { FormBuilderStatePageAreaSlice, createFormBuilderPageAreaSlice } from './FormBuilderPageArea';
import {
  FormBuilderStateAddElementDialogSlice,
  createFormBuilderAddElementDialogSlice,
} from './FormBuilderAddElementDialog';
import { RouterState } from '../utils/StateRouter';
import { QueryState, createQuery } from '../utils/StateQuery';
import {
  FormSchemaEntity,
  FormSchemaEntityUpdate,
  getFormSchemaEntity,
  updateFormSchemaEntity,
} from '../api/FormSchemaEntity';
import {
  FormBuilderStateQuestionnairePropertiesAreaSlice,
  createFormBuilderQuestionnairePropertiesAreaSlice,
} from './FormBuilderQuestionnairePropertiesArea';
import {
  FormBuilderStatePropertiesAreaSlice,
  createFormBuilderStatePropertiesAreaSlice,
} from './FormBuilderPropertiesArea';
import { AsyncState, createAsync } from '../utils/StateAsync';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState
  extends RouterState<{ formSchemaId: string }>,
    FormBuilderStateFormEngineSlice,
    FormBuilderStatePageAreaSlice,
    FormBuilderStatePreviewAreaSlice,
    FormBuilderStateQuestionnairePropertiesAreaSlice,
    FormBuilderStatePropertiesAreaSlice,
    FormBuilderStatePagePropertiesAreaSlice,
    FormBuilderStateElementPropertiesAreaSlice,
    FormBuilderStateAddElementDialogSlice {
  effectTypes: Array<{ type: string; displayName: string }>;
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
  updateFormSchemaMutation: AsyncState<boolean>;
}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(
    ({ get, set, state }) => ({
      parameters: {},
      query: {},

      effectTypes: [{ type: 'hide', displayName: 'Hide' }],

      ...createFormBuilderFormEngineSlice(state),
      ...createFormBuilderPageAreaSlice(state),
      ...createFormBuilderPreviewAreaSlice(state),
      ...createFormBuilderQuestionnairePropertiesAreaSlice(state),
      ...createFormBuilderStatePropertiesAreaSlice(state),
      ...createFormBuilderPagePropertiesAreaSlice(state),
      ...createFormBuilderElementPropertiesAreaSlice(state),
      ...createFormBuilderAddElementDialogSlice(state),

      formSchemaQuery: createQuery({
        state,
        key: 'formSchemaQuery',
        getArgs: (state: FormBuilderState) => state.parameters.formSchemaId,
        fetch: (id: string) => getFormSchemaEntity(id),
        onSuccess(formSchema) {
          const { setSchema, setPage } = get();
          setSchema(JSON.parse(formSchema.SchemaJson));
          setPage(0);
          set({
            selectedTab: 'questionnaire',
            name: formSchema.Name,
            description: formSchema.Description,
          });
        },
      }),

      updateFormSchemaMutation: createAsync({
        state,
        key: 'updateFormSchemaMutation',
        fetch: async (undraft: boolean) => {
          const body: FormSchemaEntityUpdate = {
            Name: get().name,
            Description: get().description,
            SchemaJson: JSON.stringify(get().schema),
            MetadataJson: '{}',
            IsDraft: undraft,
          };

          return await updateFormSchemaEntity(get().parameters.formSchemaId!, body);
        },
      }),
    }),
    { name: 'Form Builder' },
  );
}

export const formBuilderState = createFormBuilderState();
