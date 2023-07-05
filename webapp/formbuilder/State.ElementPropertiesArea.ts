import { FormSchemaElement } from '../formengine/Schema';
import { updateElement } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateElementPropertiesAreaSlice {
  elementToEditIndex?: number;
  elementToEdit?: FormSchemaElement;
  editElement(index: number): void;
}

export function createFormBuilderElementPropertiesAreaSlice({
  get,
  set,
  watch,
}: State<FormBuilderState>): FormBuilderStateElementPropertiesAreaSlice {
  watch(
    (s) => s.elementToEdit,
    ({ elementToEdit, elementToEditIndex }) => {
      if (elementToEdit && typeof elementToEditIndex === 'number') {
        const { page, schema, setSchema } = get();

        setSchema(
          updateElement(schema, page, elementToEditIndex, (element) => ({
            ...element,
            ...elementToEdit,
          })),
        );
      }
    },
  );

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
