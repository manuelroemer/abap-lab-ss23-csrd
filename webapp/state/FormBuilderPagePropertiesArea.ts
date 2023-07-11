import { FormSchemaPage } from '../formengine/Schema';
import { updatePage } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStatePagePropertiesAreaSlice {
  /**
   * The currently selected page.
   */
  pageToEdit?: FormSchemaPage;
  /**
   * Adds a new effect to the page.
   */
  addPageEffect(): void;
  /**
   * Deletes the effect at the given index from the currently edited page.
   * @param index The index of the effect to be deleted.
   */
  deletePageEffect(index: number): void;
}

export function createFormBuilderPagePropertiesAreaSlice({
  state,
  get,
  set,
}: State<FormBuilderState>): FormBuilderStatePagePropertiesAreaSlice {
  // Sync: schema page => pageToEdit
  state.watch(
    (s) => s.currentPage,
    ({ currentPage }) => set({ pageToEdit: currentPage }),
  );

  // Sync: pageToEdit => schema page
  state.watch(
    (s) => s.pageToEdit,
    ({ currentPage, pageToEdit }) => {
      if (currentPage && pageToEdit) {
        const { page, schema, setSchema } = get();

        setSchema(
          updatePage(schema, page, (pageToUpdate) => ({
            ...pageToUpdate,
            title: pageToEdit.title,
            effects: pageToEdit.effects,
          })),
        );
      }
    },
  );

  return {
    pageToEdit: undefined,

    addPageEffect() {
      const { pageToEdit } = get();

      if (pageToEdit) {
        const effects = pageToEdit['effects'] ?? [];
        const nextElement = {
          ...pageToEdit,
          effects: [...effects, { effect: 'hide', condition: null } as const],
        };

        set({ pageToEdit: nextElement });
      }
    },

    deletePageEffect(index: number) {
      const { pageToEdit } = get();

      if (pageToEdit) {
        const effects = pageToEdit['effects'] ?? [];
        const nextElement = {
          ...pageToEdit,
          effects: effects.filter((_, i) => i !== index),
        };

        set({ pageToEdit: nextElement });
      }
    },
  };
}
