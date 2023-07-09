import { createState } from '../utils/State';
import {
  FormBuilderStateElementPropertiesAreaSlice,
  createFormBuilderElementPropertiesAreaSlice,
} from './State.ElementPropertiesArea';
import {
  FormBuilderStatePagePropertiesAreaSlice,
  createFormBuilderPagePropertiesAreaSlice,
} from './State.PagePropertiesArea';
import { FormBuilderStatePreviewAreaSlice, createFormBuilderPreviewAreaSlice } from './State.PreviewArea';
import { FormBuilderStateFormEngineSlice, createFormBuilderFormEngineSlice } from './State.FormEngine';
import { FormBuilderStatePageAreaSlice, createFormBuilderPageAreaSlice } from './State.PageArea';
import {
  FormBuilderStateAddElementDialogSlice,
  createFormBuilderAddElementDialogSlice,
} from './State.AddElementDialog';
import { RouterState } from '../utils/StateRouter';
import { QueryState, createQuery } from '../utils/StateQuery';
import { FormSchemaEntity, getFormSchemaEntity } from '../api/FormSchemaEntity';
import {
  FormBuilderStateQuestionnairePropertiesAreaSlice,
  createFormBuilderQuestionnairePropertiesAreaSlice,
} from './State.QuestionnairePropertiesArea';

/**
 * Represents the internal state of the form builder page.
 */
export interface FormBuilderState
  extends RouterState<{ formSchemaId: string }>,
    FormBuilderStateFormEngineSlice,
    FormBuilderStatePageAreaSlice,
    FormBuilderStatePreviewAreaSlice,
    FormBuilderStateQuestionnairePropertiesAreaSlice,
    FormBuilderStatePagePropertiesAreaSlice,
    FormBuilderStateElementPropertiesAreaSlice,
    FormBuilderStateAddElementDialogSlice {
  // TODO: Extract into custom state slice.
  formSchemaQuery: QueryState<string, FormSchemaEntity>;
}

/**
 * Creates the state container for the entire form builder page.
 */
export function createFormBuilderState() {
  return createState<FormBuilderState>(({ get, state }) => ({
    ...createFormBuilderFormEngineSlice(state),
    ...createFormBuilderPageAreaSlice(state),
    ...createFormBuilderPreviewAreaSlice(state),
    ...createFormBuilderQuestionnairePropertiesAreaSlice(state),
    ...createFormBuilderPagePropertiesAreaSlice(state),
    ...createFormBuilderElementPropertiesAreaSlice(state),
    ...createFormBuilderAddElementDialogSlice(state),

    // TODO: Extract into custom state slice.
    parameters: {},
    query: {},
    formSchemaQuery: createQuery({
      state,
      key: 'formSchemaQuery',
      getArgs: (state: FormBuilderState) => state.parameters.formSchemaId,
      fetch: (id: string) => getFormSchemaEntity(id),
      onSuccess(formSchema) {
        const { setSchema } = get();
        setSchema(JSON.parse(formSchema.SchemaJson));
      },
    }),
  }));
}

export const formBuilderState = createFormBuilderState();
