import { FormSchemaPage } from '../formengine/Schema';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStatePagePropertiesAreaSlice {
  pageToEdit?: Pick<FormSchemaPage, 'id' | 'title'>;
}

export function createFormBuilderPagePropertiesAreaSlice({
  state,
  get,
  set,
}: State<FormBuilderState>): FormBuilderStatePagePropertiesAreaSlice {
  state.watch(
    (s) => s.currentPage,
    ({ currentPage }) => set({ pageToEdit: currentPage }),
  );

  state.watch(
    (s) => s.pageToEdit,
    ({ currentPage, pageToEdit }) => {
      if (currentPage && pageToEdit) {
        const { page, schema, setSchema } = get();
        const nextPages = schema.pages.map((p, index) => {
          if (index === page) {
            return {
              ...p,
              id: pageToEdit.id,
              title: pageToEdit.title,
            };
          }

          return p;
        });

        setSchema({
          ...schema,
          pages: nextPages,
        });
      }
    },
  );

  return {
    pageToEdit: undefined,
  };
}
