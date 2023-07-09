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
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';
import {
  FormBuilderStateQuestionnairePropertiesAreaSlice,
  createFormBuilderQuestionnairePropertiesAreaSlice,
} from './FormBuilderQuestionnairePropertiesArea';
import {
  FormBuilderStatePropertiesAreaSlice,
  createFormBuilderStatePropertiesAreaSlice,
} from './FormBuilderPropertiesArea';

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
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ get, set, state }) => ({
    parameters: {},
    query: {},

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
        set({ selectedTab: 'questionnaire' });
      },
    }),
  }));
}

export const formBuilderState = createFormBuilderState();
