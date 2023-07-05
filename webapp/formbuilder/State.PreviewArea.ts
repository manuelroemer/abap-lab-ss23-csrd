import { FormSchemaElement, FormSchemaElementType } from '../formengine/Schema';
import { safeSwap } from '../utils/Array';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStatePreviewAreaSlice {
  addElement(index: number, type: FormSchemaElementType): void;
  moveElementUp(index: number): void;
  moveElementDown(index: number): void;
  deleteElement(index: number): void;
}

export function createFormBuilderPreviewAreaSlice({
  state,
  get,
  set,
}: State<FormBuilderState>): FormBuilderStatePreviewAreaSlice {
  const updateElements = (fn: (elements: Array<FormSchemaElement>) => Array<FormSchemaElement>) => {
    const { page, schema, setSchema } = get();

    setSchema({
      ...schema,
      pages: schema.pages.map((currentPage, pageIndex) => {
        if (pageIndex !== page) {
          return currentPage;
        }

        return {
          ...currentPage,
          elements: fn(currentPage.elements),
        };
      }),
    });
  };

  return {
    addElement(index, type) {
      updateElements((elements) => {
        const next = [...elements];
        next.splice(index, 0, { type } as FormSchemaElement);
        return next;
      });
    },

    moveElementUp(index) {
      updateElements((elements) => safeSwap([...elements], index, index - 1));
    },

    moveElementDown(index) {
      updateElements((elements) => safeSwap([...elements], index, index + 1));
    },

    deleteElement(index) {
      updateElements((elements) => elements.filter((_, i) => i !== index));
    },
  };
}
