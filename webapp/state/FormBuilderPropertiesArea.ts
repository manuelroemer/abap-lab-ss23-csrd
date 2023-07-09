import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStatePropertiesAreaSlice {
  selectedTab: 'questionnaire' | 'page' | 'element' | 'schema' | 'state';
}

export function createFormBuilderStatePropertiesAreaSlice(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _state: State<FormBuilderState>,
): FormBuilderStatePropertiesAreaSlice {
  return {
    selectedTab: 'questionnaire',
  };
}
