import { updatePages } from '../formengine/SchemaReducers';
import { safeSwap } from '../utils/Array';
import { State } from '../utils/State';
import { FormBuilderState } from './FormBuilder';

export interface FormBuilderStatePageAreaSlice {
  addPage(): void;
  removeSelectedPage(): void;
  moveSelectedPageUp(): void;
  moveSelectedPageDown(): void;
}

export function createFormBuilderPageAreaSlice({ get }: State<FormBuilderState>): FormBuilderStatePageAreaSlice {
  return {
    addPage() {
      const { schema, setSchema, setPage } = get();

      setSchema(
        updatePages(schema, (pages) => [
          ...pages,
          {
            id: `Page ${pages.length + 1}`,
            title: 'New Page',
            elements: [],
          },
        ]),
      );

      // Auto-select the new page.
      setPage(get().schema.pages.length - 1);
    },

    removeSelectedPage() {
      const { page, schema, setPage, setSchema } = get();
      const nextPage = schema.pages.length > 0 ? Math.max(0, page - 1) : 0;
      setSchema(updatePages(schema, (pages) => pages.filter((_, index) => index !== page)));
      setPage(nextPage);
    },

    moveSelectedPageUp() {
      const { schema, page, setSchema, setPage } = get();
      setSchema(updatePages(schema, (pages) => safeSwap([...pages], page, page - 1)));
      setPage(page - 1);
    },

    moveSelectedPageDown() {
      const { schema, page, setSchema, setPage } = get();
      setSchema(updatePages(schema, (pages) => safeSwap([...pages], page, page + 1)));
      setPage(page + 1);
    },
  };
}
