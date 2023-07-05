import { FormSchemaElement, FormSchemaElementType } from '../formengine/Schema';
import { updateElements } from '../formengine/SchemaReducers';
import { safeSwap } from '../utils/Array';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStatePreviewAreaSlice {
  /**
   * Inserts a new form schema element at the given index into the form schema.
   * @param index The index at which to insert the new element.
   * @param type The type of the new element.
   */
  addElement(index: number, type: FormSchemaElementType): void;
  /**
   * Moves the element at the given index up by one position.
   * @param index The index of the element to move up.
   */
  moveElementUp(index: number): void;
  /**
   * Moves the element at the given index down by one position.
   * @param index The index of the element to move down.
   */
  moveElementDown(index: number): void;
  /**
   * Deletes the element at the given index.
   */
  deleteElement(index: number): void;
}

export function createFormBuilderPreviewAreaSlice({ get }: State<FormBuilderState>): FormBuilderStatePreviewAreaSlice {
  return {
    addElement(index, type) {
      const { page, schema, setSchema } = get();

      setSchema(
        updateElements(schema, page, (elements) => {
          const next = [...elements];
          next.splice(index, 0, { type } as FormSchemaElement);
          return next;
        }),
      );
    },

    moveElementUp(index) {
      const { page, schema, setSchema } = get();
      setSchema(updateElements(schema, page, (elements) => safeSwap([...elements], index, index - 1)));
    },

    moveElementDown(index) {
      const { page, schema, setSchema } = get();
      setSchema(updateElements(schema, page, (elements) => safeSwap([...elements], index, index + 1)));
    },

    deleteElement(index) {
      const { page, schema, setSchema } = get();
      setSchema(updateElements(schema, page, (elements) => elements.filter((_, i) => i !== index)));
    },
  };
}
