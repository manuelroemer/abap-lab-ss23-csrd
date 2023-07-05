import { FormSchemaElement } from '../formengine/Schema';
import { updateElement } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStateElementPropertiesAreaSlice {
  elementToEditIndex?: number;
  elementToEdit?: FormSchemaElement;
  setElementToEdit(index?: number): void;
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

    setElementToEdit(index) {
      const { currentPage } = get();
      set({
        elementToEdit: typeof index === 'number' ? currentPage?.elements?.[index] : undefined,
        elementToEditIndex: index,
      });
    },
  };
}
