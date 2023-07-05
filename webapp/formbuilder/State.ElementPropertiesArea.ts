import { FormSchemaElement } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateElementPropertiesAreaSlice {
  elementToEditIndex?: number;
  elementToEdit?: Partial<FormSchemaElement>;

  editElement(index: number): void;
}

export function createFormBuilderElementPropertiesAreaSlice({
  get,
  set,
}: State<FormBuilderState>): FormBuilderStateElementPropertiesAreaSlice {
  return {
    elementToEdit: undefined,
    elementToEditIndex: undefined,

    editElement(index) {
      const { currentPage } = get();
      const elementToEdit = currentPage?.elements?.[index];
      set({ elementToEdit, elementToEditIndex: index });
    },
  };
}
