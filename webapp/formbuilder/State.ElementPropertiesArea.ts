import { FormSchemaElement } from '../formengine/Schema';
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
      if (elementToEdit) {
        const { page, schema, setSchema } = get();

        setSchema({
          ...schema,
          pages: schema.pages.map((p, index) => {
            if (index !== page) {
              return p;
            }

            return {
              ...p,
              elements: p.elements.map((e, elementIndex) => {
                if (elementIndex !== elementToEditIndex) {
                  return e;
                }

                return {
                  ...e,
                  ...elementToEdit,
                };
              }),
            };
          }),
        });
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
