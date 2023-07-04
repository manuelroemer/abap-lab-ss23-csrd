import { FormSchemaElement } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateElementPropertiesAreaSlice {
  elementToEdit?: Partial<FormSchemaElement>;
}

export function createFormBuilderElementPropertiesAreaSlice(
  state: State<FormBuilderState>,
): FormBuilderStateElementPropertiesAreaSlice {
  return {
    elementToEdit: undefined,
  };
}
