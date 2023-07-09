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

export function createFormBuilderQuestionnairePropertiesAreaSlice(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _state: State<FormBuilderState>,
): FormBuilderStateQuestionnairePropertiesAreaSlice {
  return {
    name: '',
    description: '',
  };
}
