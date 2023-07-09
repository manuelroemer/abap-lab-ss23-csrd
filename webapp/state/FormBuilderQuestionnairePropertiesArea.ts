import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStateQuestionnairePropertiesAreaSlice {
  /**
   * The name of the questionnaire.
   */
  readonly name: string;
  /**
   * The description of the questionnaire.
   */
  readonly description?: string;
}

export function createFormBuilderQuestionnairePropertiesAreaSlice({
  state,
  get,
}: State<FormBuilderState>): FormBuilderStateQuestionnairePropertiesAreaSlice {
  state.watch(
    (s) => s.name,
    ({ name }) => {
      get().setState({ name: name });
    },
  );

  state.watch(
    (s) => s.description,
    ({ description }) => {
      get().setState({ description: description });
    },
  );

  return {
    name: '',
    description: '',
  };
}
