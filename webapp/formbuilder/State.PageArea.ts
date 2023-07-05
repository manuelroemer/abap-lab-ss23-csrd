import { FormSchemaPage } from '../formengine/Schema';
import { safeSwap } from '../utils/Array';
import { State } from '../utils/State';
import { FormBuilderState } from './State';

export interface FormBuilderStatePageAreaSlice {
  getSelectedPage(): FormSchemaPage | undefined;
  addPage(): void;
  removeSelectedPage(): void;
  moveSelectedPageUp(): void;
  moveSelectedPageDown(): void;
}

export function createFormBuilderPageAreaSlice({ get, set }: State<FormBuilderState>): FormBuilderStatePageAreaSlice {
  return {
    getSelectedPage() {
      const { schema, page } = get();
      const pages = schema.pages ?? [];
      return pages[page];
    },

    addPage() {
      const { schema, setSchema } = get();
      const currentPages = schema.pages ?? [];
      const newPage: FormSchemaPage = {
        id: '',
        title: '',
        elements: [],
      };

      const nextPages = [...currentPages];
      nextPages.push(newPage);

      setSchema({
        ...schema,
        pages: nextPages,
      });

      set({ page: nextPages.length - 1 });
    },

    removeSelectedPage() {
      const { schema, setSchema, page, setPage } = get();
      const currentPages = schema.pages ?? [];
      const nextPages = currentPages.filter((_, index) => index !== page);

      setSchema({
        ...schema,
        pages: nextPages,
      });

      if (nextPages.length > 0) {
        setPage(Math.max(0, page - 1));
      } else {
        setPage(0);
      }
    },

    moveSelectedPageUp() {
      const { schema, page, setSchema, setPage } = get();
      const currentPages = schema.pages ?? [];
      const nextPages = [...currentPages];
      safeSwap(nextPages, page, page - 1);
      setSchema({ ...schema, pages: nextPages });
      setPage(page - 1);
    },

    moveSelectedPageDown() {
      const { schema, page, setSchema, setPage } = get();
      const currentPages = schema.pages ?? [];
      const nextPages = [...currentPages];
      safeSwap(nextPages, page, page + 1);
      setSchema({ ...schema, pages: nextPages });
      setPage(page + 1);
    },
  };
}
