import { FormSchemaPage } from '../formengine/Schema';
import { updatePage } from '../formengine/SchemaReducers';
import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStatePagePropertiesAreaSlice {
  /**
   * The currently selected page.
   */
  pageToEdit?: FormSchemaPage;
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
            id: pageToEdit.id,
            title: pageToEdit.title,
          })),
        );
      }
    },
  );

  return {
    pageToEdit: undefined,
  };
}
